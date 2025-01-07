document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const blogContainer = document.getElementById("blog-container");
    const loadingIndicator = document.querySelector(".loading");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Constants
    const POSTS_PER_LOAD = 6;
    const TOTAL_POSTS = 100;

    // State
    let currentIndex = 0;
    let isLoading = false;
    let currentCategory = 'all';
    let allPosts = [];
    let filteredPosts = [];

    // Content Data
    const categories = ["technology", "lifestyle", "travel", "food"];
    const images = [
        "/api/placeholder/400/320",
        "/api/placeholder/400/320",
        "/api/placeholder/400/320",
        "/api/placeholder/400/320"
    ];

    const contentData = {
        technology: {
            titles: [
                "The Future of AI in 2025",
                "Blockchain Revolution",
                "Quantum Computing Explained",
                "5G Technology Impact",
                "Cybersecurity Trends",
                "The Rise of Web3",
                "IoT Innovations",
                "Cloud Computing Trends"
            ],
            content: [
                "Exploring the latest advancements in artificial intelligence and its impact on daily life...",
                "Understanding how blockchain is revolutionizing various industries...",
                "Diving deep into the world of quantum computing and its potential applications...",
                "Analyzing how 5G networks are transforming connectivity and communication...",
                "Investigating modern cybersecurity challenges and solutions...",
                "Exploring the potential of decentralized web technologies...",
                "Discovering how IoT is changing our homes and cities...",
                "Latest trends in cloud computing and digital transformation..."
            ]
        },
        lifestyle: {
            titles: [
                "Mindful Living Guide",
                "Work-Life Balance in 2025",
                "Sustainable Living Tips",
                "Mental Health Practices",
                "Productivity Hacks",
                "Modern Minimalism",
                "Digital Wellness",
                "Home Organization"
            ],
            content: [
                "Discover the art of mindful living in our fast-paced digital world...",
                "Achieving the perfect balance between work and personal life in the modern age...",
                "Simple steps towards a more sustainable and eco-friendly lifestyle...",
                "Essential tips for maintaining mental wellness in today's world...",
                "Boost your productivity with these proven techniques...",
                "Embracing minimalism in the modern world...",
                "Managing digital wellness and screen time...",
                "Creative solutions for home organization..."
            ]
        },
        travel: {
            titles: [
                "Hidden Gems in Europe",
                "Asian Adventure Guide",
                "Budget Travel Tips",
                "Digital Nomad Life",
                "Eco-Tourism Guide",
                "Local Experiences",
                "Cultural Immersion",
                "Adventure Travel"
            ],
            content: [
                "Discovering unexplored destinations across Europe...",
                "Experiencing the rich cultural heritage of Asia...",
                "Smart tips for traveling on a budget in 2025...",
                "Living the digital nomad lifestyle around the world...",
                "Exploring sustainable tourism options globally...",
                "Immersing in local experiences and traditions...",
                "Deep diving into cultural experiences worldwide...",
                "Thrilling adventure travel experiences..."
            ]
        },
        food: {
            titles: [
                "Global Cuisine Guide",
                "Healthy Recipe Collection",
                "Advanced Cooking Techniques",
                "Food Photography Tips",
                "Restaurant Reviews 2025",
                "Seasonal Cooking",
                "Fusion Cuisine",
                "Plant-Based Dining"
            ],
            content: [
                "Exploring diverse flavors and cuisines from around the world...",
                "Nutritious and delicious recipes for modern living...",
                "Master essential cooking techniques for home chefs...",
                "Tips for capturing stunning food photography...",
                "Honest reviews of trending restaurants...",
                "Cooking with seasonal ingredients...",
                "Exploring innovative fusion cuisine...",
                "Discovering the world of plant-based cooking..."
            ]
        }
    };

    const authors = [
        "Emma Thompson",
        "James Wilson",
        "Sarah Parker",
        "Michael Chen",
        "Lisa Rodriguez",
        "David Kim",
        "Maria Garcia",
        "John Smith",
        "Ana Patel",
        "Thomas Wright"
    ];

    // Helper Functions
    function getRandomDate() {
        const start = new Date(2024, 0, 1);
        const end = new Date(2025, 0, 7);
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
            .toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
    }

    function generateBlogPost(index) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const categoryData = contentData[category];
        const titleIndex = Math.floor(Math.random() * categoryData.titles.length);
        const contentIndex = Math.floor(Math.random() * categoryData.content.length);

        return {
            id: index + 1,
            title: categoryData.titles[titleIndex],
            author: authors[Math.floor(Math.random() * authors.length)],
            date: getRandomDate(),
            category: category,
            image: images[Math.floor(Math.random() * images.length)],
            content: categoryData.content[contentIndex]
        };
    }

    function createPostElement(post) {
        const article = document.createElement('article');
        article.className = 'article';
        article.innerHTML = `
            <div class="article-image" style="background-image: url('${post.image}')"></div>
            <div class="article-content">
                <h2>${post.title}</h2>
                <div class="meta">
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-calendar"></i> ${post.date}</span>
                    <span><i class="fas fa-tag"></i> ${post.category}</span>
                </div>
                <p class="article-preview">${post.content}</p>
                <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        return article;
    }

    async function loadPosts() {
        if (isLoading) return;
        
        isLoading = true;
        loadingIndicator.classList.add("visible");

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const postsToLoad = filteredPosts.slice(currentIndex, currentIndex + POSTS_PER_LOAD);
        
        postsToLoad.forEach((post, index) => {
            const article = createPostElement(post);
            blogContainer.appendChild(article);
            
            // Stagger the animation of posts appearing
            setTimeout(() => article.classList.add("visible"), 100 * index);
        });

        currentIndex += POSTS_PER_LOAD;
        isLoading = false;
        loadingIndicator.classList.remove("visible");

        // Update infinite scroll status
        if (currentIndex >= filteredPosts.length) {
            window.removeEventListener('scroll', handleScroll);
        }
    }

    function handleScroll() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 300 && currentIndex < filteredPosts.length) {
            loadPosts();
        }
    }

    function filterPosts(category) {
        currentCategory = category;
        currentIndex = 0;
        blogContainer.innerHTML = '';
        
        // Filter posts based on category
        filteredPosts = category === 'all' 
            ? allPosts 
            : allPosts.filter(post => post.category === category);

        // Reset infinite scroll
        window.removeEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScroll);
        
        loadPosts();
    }

    // Event Listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter posts
            filterPosts(button.dataset.category);
        });
    });

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const header = document.querySelector('header');
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Initialize
    function init() {
        // Generate all posts
        allPosts = Array.from({ length: TOTAL_POSTS }, (_, index) => generateBlogPost(index));
        filteredPosts = allPosts;

        // Load initial posts
        loadPosts();

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);
    }

    init();
});
