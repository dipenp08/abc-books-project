import json
import boto3
from datetime import datetime
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
books_table = dynamodb.Table('Books')
counter_table = dynamodb.Table('BookCounter')

def get_next_id():
    try:
        # Try to get the current counter
        response = counter_table.get_item(
            Key={'counterId': 'bookId'}
        )
        
        if 'Item' in response:
            # Increment existing counter
            current_id = response['Item']['currentValue']
            next_id = current_id + 1
        else:
            # Initialize counter if it doesn't exist
            next_id = 1
            
        # Update the counter
        counter_table.put_item(
            Item={
                'counterId': 'bookId',
                'currentValue': next_id
            }
        )
        
        return str(next_id)
        
    except Exception as e:
        print(f"Error getting next ID: {str(e)}")
        # Fallback to timestamp if counter fails
        return str(int(datetime.now().timestamp()))

def lambda_handler(event, context):
    try:
        # Parse the incoming JSON body
        book_data = json.loads(event['body'])
        
        # Generate the next book ID
        book_data['bookId'] = get_next_id()
        
        # Add timestamp
        book_data['createdAt'] = datetime.now().isoformat()
        
        # Convert any Decimal types to int/float for JSON serialization
        def decimal_to_int(obj):
            if isinstance(obj, Decimal):
                return int(obj)
            return obj
        
        # Add the book to DynamoDB
        books_table.put_item(Item=book_data)
        
        # Convert Decimal to int for response
        response_data = json.loads(json.dumps(book_data, default=decimal_to_int))
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps(response_data)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'error': str(e)
            })
        } 