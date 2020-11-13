import { ServiceBusClient, ReceiveMode, ServiceBusMessage } from "@azure/service-bus";
import { AZURE_SERVICEBUS_CONNECTION_STRING, AZURE_SERVICEBUS_QUEUE } from "./app-config";
import { BookInfo } from './book-info';
import { BrowserUtils } from './browser-utils';
import { Repository } from "./repository";

async function main() {
    const sbClient = ServiceBusClient.createFromConnectionString(AZURE_SERVICEBUS_CONNECTION_STRING);
    const queueClient = sbClient.createQueueClient(AZURE_SERVICEBUS_QUEUE);
    const receiver = queueClient.createReceiver(ReceiveMode.peekLock);
    const browserUtils = new BrowserUtils();
    let currentBatchMsgs = new Array<ServiceBusMessage>();
    const repository = new Repository();

    const msgHandler = async (message: ServiceBusMessage) => {
        const book: BookInfo = <any>{ ...message.userProperties };
        await browserUtils.getBookImages(book.isbn13, book.bookId);
        console.log('image extracted', book.isbn13);
        currentBatchMsgs = currentBatchMsgs.filter(msg => msg.messageId != message.messageId);
        console.log('remaining messages', currentBatchMsgs.length);
    };

    const onErrorHandler = (err: any) => {
        console.log("Error occurred: ", err);
    };

    try {

        const conn = await repository.GetConnection();
        let fetchInProgress = false;
        while (true) {
            console.log('fetch start');

            const messages = await receiver.receiveMessages(30);
            currentBatchMsgs.push(...messages);
            await Promise.all(messages.map(msgHandler));
            const ids = messages.map(msg => "\'" + msg.messageId + "\'");//.join(",");
            if (ids.length > 0) {
                const query = `UPDATE [dbo].[BookInformation] SET IsImageDownloaded = 'True' WHERE Id IN(${ids.join(",")})`;
                await conn.request().query(query);
                console.log('query', query);
                const msgCompleteReq = messages.map(msg => msg.complete());
                await Promise.all([...msgCompleteReq]);
                console.log('fetched data for ', ids.length);
            }

            console.log('fetch end');
        }
    } catch (err) {
        console.log('error on while read', err);
    }
    finally {
        await sbClient.close();
    }
}

main().catch((err) => {
    console.log("Error occurred: ", err);
});