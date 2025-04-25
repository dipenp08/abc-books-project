import json
import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Books')

def lambda_handler(event, context):
    try:
        # Get the book ID from the path parameters
        book_id = event['pathParameters']['id']
        
        # Parse the incoming JSON body for updated data
        updated_data = json.loads(event['body'])
        
        # Remove bookId from updated_data if present, as it shouldn't be changed
        if 'bookId' in updated_data:
            del updated_data['bookId']

        # Construct the update expression
        update_expression = "SET "
        expression_attribute_values = {}
        expression_attribute_names = {}
        
        # Add updatedAt timestamp
        updated_data['updatedAt'] = datetime.now().isoformat()

        i = 0
        for key, value in updated_data.items():
            # Use ExpressionAttributeNames to handle reserved keywords
            placeholder = f"#k{i}"
            expression_attribute_names[placeholder] = key
            update_expression += f"{placeholder} = :v{i}, "
            expression_attribute_values[f':v{i}'] = value
            i += 1
        
        # Remove the trailing comma and space
        update_expression = update_expression.rstrip(', ')

        # Perform the update
        response = table.update_item(
            Key={
                'bookId': book_id
            },
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ExpressionAttributeNames=expression_attribute_names,
            ReturnValues="UPDATED_NEW"  # Returns the new values of the updated attributes
        )

        # Fetch the complete updated item to return
        updated_item_response = table.get_item(Key={'bookId': book_id})
        updated_item = updated_item_response.get('Item', {})

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,PUT'
            },
            'body': json.dumps(updated_item)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,PUT'
            },
            'body': json.dumps({
                'error': str(e)
            })
        } 