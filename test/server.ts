import type { Test } from 'uvu'
import * as path from 'path'
import { ChildProcess, spawn } from 'child_process'

const randomPort = () => Math.floor(Math.random() * 55535) + 10000

export class TestServer {
    private port: number
    private process: ChildProcess

    private constructor(port: number, process: ChildProcess) {
        this.port = port
        this.process = process
    }

    get url(): string {
        return `http://127.0.0.1:${this.port}`
    }

    endpoint = (e: string) => `${this.url}${e}`

    close = () => {
        this.process.kill()
    }

    static start = async (): Promise<TestServer> => {
        const port = randomPort()
        const process = spawn(path.join('node_modules', '.bin', 'svelte-kit'), ['dev', '-p', `${port}`])

        // wait for the server to actually start
        // TODO should replace with reading from stdout for a signal
        await new Promise(resolve => setTimeout(resolve, 500))

        return new TestServer(port, process)
    }
}

type Context = Record<string, any>

export type TestServerContext = {
    server: TestServer,
}

export const withTestServer = <T extends Context = Context>(test: Test<T>): Test<T & TestServerContext> => {
    (test as Test<T & TestServerContext>).before(async (context) => {
        context.server = await TestServer.start()
    })
    
    test.after(({ server }) => {
        server.close()
    })

    return test as Test<T & TestServerContext>
}
