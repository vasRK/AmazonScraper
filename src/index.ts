import { ServiceBusClient, ReceiveMode, ServiceBusMessage } from "@azure/service-bus";
import { AZURE_SERVICEBUS_CONNECTION_STRING, AZURE_SERVICEBUS_QUEUE } from "./app-config";
import { BookInfo } from './book-info';
import { ImageScraper } from './browser-utils';
import { Repository } from "./repository";
import { _logger } from './logger'
async function main() {
    const sbClient = ServiceBusClient.createFromConnectionString(AZURE_SERVICEBUS_CONNECTION_STRING);
    const queueClient = sbClient.createQueueClient(AZURE_SERVICEBUS_QUEUE);
    const receiver = queueClient.createReceiver(ReceiveMode.peekLock);
    const scraper = new ImageScraper();
    const repository = new Repository();

    const msgHandler = async (message: ServiceBusMessage) => {
        const book: BookInfo = <any>{ ...message.userProperties };
        const response = await scraper.getBookImages(book.isbn13);
        return { ...response, bookId: book.bookId };
    };

    try {
        const conn = await repository.GetConnection();
        while (true) {
            _logger.info('batch start');
            const messages = await receiver.receiveMessages(30);
            const extractResponses = await Promise.all(messages.map(msgHandler));
            const completeBookIds = extractResponses.filter(res => res.success).map(res => res.bookId);
            if (completeBookIds.length > 0) {
                const query = `UPDATE [dbo].[BookInformation] SET IsImageDownloaded = 'True' WHERE Id IN(${completeBookIds.map(msgId => "\'" + msgId + "\'").join(",")})`;
                await conn.request().query(query);
            }

            const failedBookIds = extractResponses.filter(res => !res.success).map(res => res.bookId);
            if (failedBookIds.length > 0) {
                _logger.error(`image extraction failed for book ids ${failedBookIds.join()}`)
            }

            const msgCompleteReq = messages.map(msg => msg.complete());
            const res = await Promise.all([...msgCompleteReq]);
            _logger.info('batch end total messages ', messages.length);
            // throw new exception("user exp");
        }
    } catch (err) {
        _logger.error('error on while read', err);
        process.exit(1);
    }
    finally {
        await sbClient.close();
    }

    process.exit(0);
}

main().catch((err) => {
    console.log("Error occurred: ", err);
});