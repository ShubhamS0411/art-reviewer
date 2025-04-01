import { memo } from "react";

import { Helmet } from "react-helmet";

const Homepage = memo(function Homepage() {
    return (
        <>
            <Helmet>
                <title>Art Review - Share and Review Artwork</title>
                <meta name="description" content="Platform to share artwork and write reviews" />
                <meta name="keywords" content="art, reviews, artwork sharing, community" />
                <meta name="robots" content="index, follow" />
            </Helmet>
            <main aria-label="main content" className="bg-gray-100 min-h-screen">
                <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                    <article className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                            Welcome to Art Review
                        </h1>
                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                            This is a platform where you can share your art with the world or enrich the community with your insightful reviews.
                        </p>
                    </article>
                </div>
            </main>
        </>
    );
});
export default Homepage;