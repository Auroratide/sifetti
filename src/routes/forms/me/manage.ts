import type { RequestHandler } from '@sveltejs/kit'
import { handle, withAuth, withFormData } from '../../api/_middleware'
import { people } from '$lib/beans'
import { ProfileName, ProfileNameReporter } from '$lib/people/profile-name'
import { isLeft } from 'fp-ts/lib/Either.js'
import { found } from '$lib/routing/respond'

type ChangeInfoFormData = {
    get: (key: 'name') => string,
}

export const post: RequestHandler = handle(withAuth, withFormData)(async ({ request, locals }) => {
    const body = await request.formData() as ChangeInfoFormData

    const nameValidation = ProfileName.decode(body.get('name'))
    if (isLeft(nameValidation)) {
        const violation = ProfileNameReporter.report(nameValidation)
        return found('/me/manage', {
            problem: violation[0],
        })
    }

    await people.rename(locals.accessToken, nameValidation.right)

    return found('/me/manage')
})
