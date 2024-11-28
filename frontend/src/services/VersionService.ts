export class VersionService {
    private base = `${process.env.NEXT_PUBLIC_API_URL}/version`;

    async get() {
        const response = await fetch(this.base, {credentials: 'include'});

        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Could not get version');
        }
    }
}
