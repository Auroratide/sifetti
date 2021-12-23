<script lang="ts">
    let email: string
    let password: string
    let confirmPassword: string

    const submit = () => {
        if (password !== confirmPassword) {
            alert('Uh oh! passwords do not match')
            return
        }

        fetch('/api/sign-up', {
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
    <label for="confirm-password">Confirm Password:</label>
    <input id="confirm-password" name="confirm-password" type="password" bind:value={confirmPassword} />
    <button type="submit">Sign Up!</button>
</form>
