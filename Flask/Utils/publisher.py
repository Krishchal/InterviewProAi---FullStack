# ============================FOR RABBITMQ LOCAL==========================
# import pika

# def publish_message(queue_name, message):
#     # connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
#     connection = pika.BlockingConnection(pika.ConnectionParameters(host='amqps://svrpcyts:pvWw_HcMliQvSqr2KqZmD93mR1vDpzPg@campbell.lmq.cloudamqp.com/svrpcyts'))
#     channel = connection.channel()

#     # Declare a queue
#     channel.queue_declare(queue=queue_name, durable=True)

#     # Publish a message
#     channel.basic_publish(exchange='',
#                           routing_key=queue_name,
#                           body=message,
#                           properties=pika.BasicProperties(
#                               delivery_mode=2,  # Make message persistent
#                           ))

#     print("\n[x] Message published to RabbitMQ")
#     connection.close()


# if __name__=="__main__":
#     queue_name = "transcribed-text"
#     message = "Hello, World!"
#     publish_message(queue_name, message)  # Publish a message to the queue

# ============================FOR RABBITMQ CLOUD==========================
import pika
import ssl
import os
from dotenv import load_dotenv
load_dotenv()


def publish_message(queue_name, message):
    # Set up SSL context for a secure connection
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE

    # Using SSL connection
    connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='campbell.lmq.cloudamqp.com',
        virtual_host='svrpcyts',
        credentials=pika.PlainCredentials(
            os.getenv("USERNAME"), os.getenv("PASSWORD")),
        ssl_options=pika.SSLOptions(context)
    ))

    channel = connection.channel()

    # Declare a queue
    channel.queue_declare(queue=queue_name, durable=True)

    # Publish a message
    channel.basic_publish(exchange='',
                          routing_key=queue_name,
                          body=message,
                          properties=pika.BasicProperties(
                              delivery_mode=2,  # Make message persistent
                          ))

    print("\n[x] Message published to RabbitMQ")
    connection.close()


if __name__ == "__main__":
    queue_name = "transcribed-text"
    message = "Hello, World!"
    publish_message(queue_name, message)  # Publish a message to the queue
