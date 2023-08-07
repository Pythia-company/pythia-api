const url = "http://localhost:8888";

const testRequest = async() => {
    await fetch(`${url}/markets/0x`)
}

await testRequest();
