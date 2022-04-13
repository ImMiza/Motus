function shuffleArray(array: any[]): any[] {
    for (let i = 0; i < array.length; i++) {
        const randomNumber: number = Math.floor(Math.random() * (array.length - 1));
        const temp = array[i];
        array[i] = array[randomNumber];
        array[randomNumber] = temp;
    }

    return array;
}

function normalizeText(text: string): string {
    return text.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '').toLowerCase();
}

export {
    shuffleArray,
    normalizeText
}