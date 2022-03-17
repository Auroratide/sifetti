export const string = (length = 8, characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'): string => {
    let letters = Array(length)
    for (let i = 0; i < letters.length; ++i) {
        letters[i] = characters[Math.floor(Math.random() * characters.length)]
    }

    return letters.join('')
}
