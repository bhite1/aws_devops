# GPT prompt

Create a new practice exam with 20 questions for the AWS Certified DevOps Engineer - Professional certification. Questions should be challenging and densely worded, between 4-7 sentences. Answers should be multiple choice. Include a field that explains the correct answer and why the others are wrong. Output only the question, choices, answer, and explanation in JSON format.

# Installation steps
## From CloudFormation
1. Create an EC2 KeyPair from the Management Console. It won't be used but is needed for the stack to create.
2. Use the provided `cloudformation-template.json` and wait for the EC2 instance to pass its status checks.

## From an EC2 Instance
```
sudo yum install -y nodejs git
git clone https://github.com/bhite1/aws_devops.git
cd aws_devops/
npm install express ejs body-parser

sudo npm install pm2 -g
pm2 start app.js --name "awsdevopsquiz"
pm2 startup
pm2 save
```

Now, to start your web app, simply run node app.js from your project directory in the terminal. Then, open a web browser and go to http://\<public-ip\>:3000/ to start the quiz.
