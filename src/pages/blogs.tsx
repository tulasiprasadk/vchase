import React, { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

// Blog post interface
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  readTime: number;
  imageUrl?: string;
}

// Sample blog data
const SAMPLE_BLOGS: BlogPost[] = [
  {
    id: "1",
    title: "The Ultimate Guide to Event Sponsorship Success",
    excerpt:
      "Learn how to maximize your ROI from event sponsorships with proven strategies and real-world examples.",
    content: "Full content here...",
    author: "Sarah Johnson",
    publishedAt: "2024-01-15",
    category: "Sponsorship",
    tags: ["events", "marketing", "ROI"],
    readTime: 8,
  },
  {
    id: "2",
    title: "Building Strong Partnerships Between Sponsors and Organizers",
    excerpt:
      "Discover the key elements of successful sponsor-organizer relationships and how to maintain them.",
    content: "Full content here...",
    author: "Mike Chen",
    publishedAt: "2024-01-10",
    category: "Partnerships",
    tags: ["relationships", "collaboration", "events"],
    readTime: 6,
  },
  {
    id: "3",
    title: "Digital Marketing Trends for Event Planners in 2024",
    excerpt:
      "Stay ahead of the curve with the latest digital marketing strategies for promoting your events.",
    content: "Full content here...",
    author: "Emma Davis",
    publishedAt: "2024-01-05",
    category: "Marketing",
    tags: ["digital marketing", "trends", "social media"],
    readTime: 10,
  },
  {
    id: "4",
    title: "Measuring Event Success: Key Metrics Every Organizer Should Track",
    excerpt:
      "Learn which metrics matter most when evaluating the success of your events and sponsorships.",
    content: "Full content here...",
    author: "David Wilson",
    publishedAt: "2023-12-28",
    category: "Analytics",
    tags: ["metrics", "analytics", "success"],
    readTime: 7,
  },
  {
    id: "5",
    title: "Sustainable Event Planning: Going Green While Maintaining Quality",
    excerpt:
      "Explore eco-friendly practices that can make your events more sustainable without compromising on experience.",
    content: "Full content here...",
    author: "Lisa Green",
    publishedAt: "2023-12-20",
    category: "Sustainability",
    tags: ["sustainability", "environment", "events"],
    readTime: 9,
  },
  {
    id: "6",
    title: "The Rise of Virtual and Hybrid Events: What Sponsors Need to Know",
    excerpt:
      "Understanding the virtual event landscape and how to effectively sponsor hybrid experiences.",
    content: "Full content here...",
    author: "Tom Rodriguez",
    publishedAt: "2023-12-15",
    category: "Virtual Events",
    tags: ["virtual", "hybrid", "technology"],
    readTime: 11,
  },
];

const BLOG_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "partnerships", label: "Partnerships" },
  { value: "marketing", label: "Marketing" },
  { value: "analytics", label: "Analytics" },
  { value: "sustainability", label: "Sustainability" },
  { value: "virtual-events", label: "Virtual Events" },
];

const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate API call
    const loadBlogs = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setBlogs(SAMPLE_BLOGS);
      setLoading(false);
    };

    loadBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "all" ||
      blog.category
        .toLowerCase()
        .replace(/\s+/g, "-")
        .includes(selectedCategory);

    const matchesSearch =
      searchTerm === "" ||
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Blog - EventSponsor</title>
        <meta
          name="description"
          content="Insights, tips, and strategies for event sponsorship and organization"
        />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                EventSponsor Blog
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Insights, strategies, and expert advice for successful event
                sponsorship and organization
              </p>
            </div>
          </div>

          {/* Filters Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="w-full md:w-64">
                  <SearchableSelect
                    options={BLOG_CATEGORIES}
                    value={selectedCategory}
                    onSelect={setSelectedCategory}
                    placeholder="Select category..."
                    searchPlaceholder="Search categories..."
                  />
                </div>
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <Card
                  key={blog.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {blog.imageUrl && (
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden flex items-center justify-center">
                      <div className="text-6xl opacity-20">📝</div>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {blog.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {blog.readTime} min read
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span>By {blog.author}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(blog.publishedAt)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredBlogs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No articles found matching your criteria.
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="mt-16 bg-white rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Stay Updated
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get the latest insights on event sponsorship and organization
                delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default BlogsPage;
