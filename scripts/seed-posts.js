/**
 * Seed Script: Sample Blog Posts
 * 
 * Run with: node scripts/seed-posts.js
 */

const PocketBase = require('pocketbase').default;

const posts = [
    {
        title: "Getting Started with Film Equipment Rental",
        slug: "getting-started-film-equipment-rental",
        content: `
            <h2>Welcome to Professional Filmmaking</h2>
            <p>Whether you're shooting a documentary, commercial, or feature film, having the right equipment is crucial. In this guide, we'll cover the essentials you need to get started.</p>
            <h3>Camera Selection</h3>
            <p>Choosing the right camera depends on your project requirements. For cinematic work, consider the <strong>RED Komodo</strong> or <strong>ARRI Alexa Mini</strong>. For run-and-gun documentary work, the <strong>Sony FX6</strong> offers excellent versatility.</p>
            <h3>Lighting Basics</h3>
            <p>Good lighting can transform your footage. Start with a basic three-point lighting setup and expand from there.</p>
        `,
        excerpt: "Your complete guide to selecting the right film equipment for your next production.",
        published: true
    },
    {
        title: "Top 5 Cameras for Documentary Filmmaking",
        slug: "top-5-cameras-documentary-filmmaking",
        content: `
            <h2>Best Cameras for Documentary Work</h2>
            <p>Documentaries require cameras that are versatile, reliable, and capable of capturing stunning footage in unpredictable conditions.</p>
            <ol>
                <li><strong>Sony FX6</strong> - Compact full-frame cinema camera</li>
                <li><strong>Canon C70</strong> - Excellent autofocus and dual card slots</li>
                <li><strong>Blackmagic Pocket 6K Pro</strong> - Best value for RAW recording</li>
                <li><strong>Panasonic S1H</strong> - Hybrid still/video powerhouse</li>
                <li><strong>RED Komodo</strong> - Compact cinema camera with global shutter</li>
            </ol>
            <p>Each camera has its strengths. Consider your specific needs before making a choice.</p>
        `,
        excerpt: "Discover the best cameras for capturing compelling documentary footage.",
        published: true
    },
    {
        title: "Essential Lighting Techniques for Interviews",
        slug: "essential-lighting-techniques-interviews",
        content: `
            <h2>Professional Interview Lighting</h2>
            <p>Great interview lighting makes your subject look their best while maintaining a professional, cinematic feel.</p>
            <h3>The Classic Three-Point Setup</h3>
            <p>The foundation of interview lighting includes:</p>
            <ul>
                <li><strong>Key Light</strong> - Your main light source, placed at 45 degrees</li>
                <li><strong>Fill Light</strong> - Softens shadows on the opposite side</li>
                <li><strong>Back Light</strong> - Separates subject from background</li>
            </ul>
            <h3>Modern Techniques</h3>
            <p>Today's cinematographers often use LED panels with adjustable color temperature for maximum flexibility on set.</p>
        `,
        excerpt: "Master the art of lighting interviews with these professional techniques.",
        published: true
    }
];

async function seedPosts() {
    const pb = new PocketBase('http://127.0.0.1:8090');

    console.log('Seeding posts...');

    for (const post of posts) {
        try {
            const record = await pb.collection('posts').create(post);
            console.log(`✓ Created: ${post.title} (${record.id})`);
        } catch (error) {
            console.error(`✗ Failed: ${post.title}`, error.message);
        }
    }

    console.log('\nDone! Visit http://localhost:3000/en/blog/getting-started-film-equipment-rental');
}

seedPosts();
