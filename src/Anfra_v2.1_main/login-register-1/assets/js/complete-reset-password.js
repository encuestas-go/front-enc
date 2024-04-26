function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function redirect() {
    await sleep(3500);
    window.location.href = 'index.html';
}

redirect(); 
