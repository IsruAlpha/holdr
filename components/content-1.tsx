export default function Content() {
    return (
        <section className="bg-background @container py-24">
            <div className="@2xl:grid-cols-2 mx-auto grid max-w-3xl gap-6 px-6">
                <h2 className="text-balance font-serif text-4xl font-medium">Discover Movies Your Way</h2>

                <div className="flex flex-col gap-6">
                    <p className="text-muted-foreground">
                        <span className="text-foreground font-medium">Personalized Recommendations</span> Get movie suggestions tailored to your taste based on your watch history and preferences.
                    </p>

                    <p className="text-muted-foreground">
                        <span className="text-foreground font-medium">Social Watchlists</span> Create collaborative watchlists with friends and plan your next movie night together.
                    </p>

                    <p className="text-muted-foreground">
                        <span className="text-foreground font-medium">Smart Organization</span> Organize your collection with custom tags, ratings, and notes to remember why you wanted to watch each film.
                    </p>
                </div>
            </div>
        </section>
    )
}
