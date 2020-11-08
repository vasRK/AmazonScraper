import { ServiceBusClient, ReceiveMode, ServiceBusMessage } from "@azure/service-bus";
import { BookInfo } from './book-info';
import { BrowserUtils } from './browser-utils';

const conStr = process.env.AZURE_SERVICEBUS_CONNECTION_STRING;
const qName = "testq";

async function main() {
    const sbClient = ServiceBusClient.createFromConnectionString(conStr);
    const queueClient = sbClient.createQueueClient(qName);
    const receiver = queueClient.createReceiver(ReceiveMode.peekLock);
    const browserUtils = new BrowserUtils();

    const msgHandler = async (message: ServiceBusMessage) => {
        const book: BookInfo = <any>{ ...message.userProperties };
        await browserUtils.getBookImages(book.isbn13, book.bookId);
        console.log('image extracted', book.isbn13);
        await message.complete();
    };

    const onErrorHandler = (err: any) => {
        console.log("Error occurred: ", err);
    };

    try {
        while (true) {
            const messages = await receiver.receiveMessages(1);
            messages.forEach(msgHandler);
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