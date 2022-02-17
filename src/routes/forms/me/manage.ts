import type { RequestHandler } from '@sveltejs/kit'
import { handle, withAuth, withFormData } from '../../api/_middleware'
import { people } from '$lib/beans'
import { ProfileName } from '$lib/people/profile-name'
import { HttpStatus } from '$lib/routing/http-status'
import { isLeft } from 'fp-ts/lib/Either.js'

type ChangeInfoFormData = {
    get: (key: 'name') => string,
}

export const post: RequestHandler = handle(withAuth, withFormData)(async ({ request, locals }) => {
    const body = await request.formData() as ChangeInfoFormData

    const nameValidation = ProfileName.decode(body.get('name'))
    if (isLeft(nameValidation)) {
        const violation = nameValidation.left[0].context
        return new Response(null, {
            status: HttpStatus.Found,
            headers: new Headers({
                Location: `/me/manage?problem=${violation[violation.length - 1].type.name}`,
            }),
        })
    }

    await people.rename(locals.accessToken, nameValidation.right)

    return new Response(null, {
        status: HttpStatus.Found,
        headers: new Headers({
            Location: '/me/manage',
        }),
    })
})
