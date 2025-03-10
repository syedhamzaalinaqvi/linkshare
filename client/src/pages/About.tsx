export default function About() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">About WhatsApp Group Hub</h2>
      
      <div className="prose max-w-none">
        <p className="mb-4">
          WhatsApp Group Hub is a platform dedicated to helping people discover and join WhatsApp groups that match their interests. 
          Our mission is to connect communities and make it easier to find relevant groups without having to search across multiple websites.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">How It Works</h3>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>Browse through our curated collection of WhatsApp groups organized by categories</li>
          <li>Use the search functionality to find specific groups that match your interests</li>
          <li>Copy the group link and open it in WhatsApp to join the group</li>
          <li>Submit your own WhatsApp group to share it with our community</li>
        </ol>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Our Guidelines</h3>
        <p className="mb-4">
          To maintain a safe and valuable platform for everyone, we have some basic guidelines for groups:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>No illegal content or activities</li>
          <li>No hate speech, harassment, or bullying</li>
          <li>No spam or misleading information</li>
          <li>Accurate group descriptions that match the actual group content</li>
          <li>Respect for intellectual property rights</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Contact Us</h3>
        <p className="mb-4">
          If you have any questions, suggestions, or concerns, please feel free to contact us at:
          <a href="mailto:contact@whatsappgrouphub.com" className="text-primary hover:underline ml-1">
            contact@whatsappgrouphub.com
          </a>
        </p>
      </div>
    </div>
  );
}
