import rp from "request-promise"

main()

async function main() {
    try {
        const comments = await jsonResponseGET()
        const result = comments.filter((e) => e.id % 2 === 1).map((element) => {
            return {
                id: element.id,
                name: element.name,
                email: element.email,
                body: element.body.split("\n").map(e => e.trim()).join(" ")
            }
        })
        console.log(JSON.stringify(result));
        return JSON.stringify(result)
    }
    catch (error) {
        console.log(`Some error ${error.message}`);
        return null
    }
}

async function jsonResponseGET() {
    try {
        return await rp({
            uri: "https://jsonplaceholder.typicode.com/comments",
            json: true,
            method: "GET"
        })
    } catch (error) {
        console.log(`Some error ${error.message}`)

        return null
    }
}
