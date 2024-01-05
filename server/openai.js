let date = new Date()
let logdate = date.getFullYear() + '-' + (1 + date.getMonth()) + '-' + date.getDate()
console.log()


const OpenAI= require('openai')
const openai = new OpenAI({apiKey: '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'});

async function main() {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Does this photo contain a waterbottle?" },
          {
            type: "image_url",
            image_url: {
              "url": "https://www.istockphoto.com/photos/person-holding-water-bottle",
            },
          },
        ],
      },
    ],
  });
  console.log(response.choices[0]);
}
main();