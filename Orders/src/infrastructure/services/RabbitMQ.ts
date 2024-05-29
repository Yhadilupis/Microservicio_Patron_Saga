import dotenv from "dotenv";
import amqp from 'amqplib';
import * as process from "process";

dotenv.config();

export class RabbitMQ {

    //sendToQueue que toma un mensaje como argumento y lo envía a una cola RabbitMQ. (asincrono)
    async sendToQueue(message: any) {
        try {
            //Se establece una conexión con RabbitMQ utilizando la URL obtenida de las variables de entorno.
            const RABBITMQ_URL_VARIABLE = process.env.RABBITMQ_URL;
            if (RABBITMQ_URL_VARIABLE !== undefined) {
                //e crea un canal de comunicación dentro de la conexión. 
                const connection = await amqp.connect(RABBITMQ_URL_VARIABLE);
                const channel = await connection.createChannel();
                //nombre de la cola
                const queue = 'orders_caffeup';

                await channel.assertQueue(queue, { durable: true });
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });

                console.log('Mensaje enviado a la caffeup:', message);
                await channel.close();
                await connection.close();
            } else {
                throw new Error("RABBITMQ_URL no está definido en el archivo .env");
            }
        } catch (e) {
            console.error("Error en RabbitMQ:\n", e);
        }
    }
}