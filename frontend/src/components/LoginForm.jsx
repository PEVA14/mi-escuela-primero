export default function LoginForm() {
     return (
        <form action="/api/login" method="POST"> 
            <label htmlFor=""> Username </label>
            <input type="text" />
            <label htmlFor=""> Password </label>
            <input type="text" />

        </form>
    )
}