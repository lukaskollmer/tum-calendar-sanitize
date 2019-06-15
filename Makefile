deploy-lambda:
	npm i
	zip -r -q lambda.zip main.js package.json node_modules/*
	aws --region eu-central-1 lambda update-function-code --function-name tum-calendar-sanitize --zip-file fileb://lambda.zip
	rm lambda.zip
