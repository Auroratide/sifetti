<script lang="ts">
    let email: string
    let password: string

    const submit = () => {
        fetch('/api/sign-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            })
        }).then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw res.json()
            }
        }).then(data => {
            console.log(data)
        }).catch(err => {
            console.error(err)
        })
    }
</script>

<form on:submit|preventDefault={submit}>
    <label for="email">Email:</label>
    <input id="email" name="email" type="text" bind:value={email} />
    <label for="password">Password:</label>
    <input id="password" name="password" type="password" bind:value={password} />
    <button type="submit">Sign In!</button>
</form>
