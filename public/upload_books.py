import boto3
import json

# ✅ Set region to us-east-1
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Make sure the table name is exactly correct (case-sensitive!)
table = dynamodb.Table('Books')

# Load book data
with open('books.json') as f:
    books = json.load(f)

# Upload each book
for book in books:
    print("Uploading:", book)
    try:
        response = table.put_item(Item=book)
        print(f"✅ Uploaded: {book['bookId']} - {book['Title']}")
    except Exception as e:
        print("❌ Error uploading book:", e)

print("✅ Done.")
