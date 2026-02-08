export function getCookie(name: string): string | null {
	if (typeof window === 'undefined') return null;
	
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	
	if (parts.length === 2) {
		const cookieValue = parts.pop()?.split(';').shift();
		return cookieValue || null;
	}
	
	return null;
}

export function setCookie(name: string, value: string, days: number = 7): void {
	if (typeof window === 'undefined') return;
	
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	const expires = `expires=${date.toUTCString()}`;
	document.cookie = `${name}=${value};${expires};path=/`;
}

export function deleteCookie(name: string): void {
	if (typeof window === 'undefined') return;
	
	document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}
