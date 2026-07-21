import asyncio

from ollama import AsyncClient

client = AsyncClient()


async def get_model():
    response = await AsyncClient().list()
    models_dict = {i: model.model for i, model in enumerate(response.models, start=1)}
    return models_dict


async def work():
    models = await get_model()
    print(models)
    number_model = int(input())
    selected_model_name = models[number_model]

    messages = []  # replace in ORM
    while True:
        prompt = input("You: ")
        if prompt.lower() in ["exit", "quit"]:
            break

        messages.append({"role": "user", "content": prompt})
        response = await client.chat(
            model=selected_model_name, messages=messages, think=False
        )

        bot_reply = response["message"]["content"]
        print(f"Bot: {bot_reply}\n")

        messages.append({"role": "assistant", "content": bot_reply})  # replace in ORM


if __name__ == "__main__":
    asyncio.run(work())
