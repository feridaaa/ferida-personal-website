export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t-2 border-mahogany mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-charcoal font-serif">
            Reading 52 books a year, one review at a time
          </p>
          <p className="text-sm text-gray-600 mt-2">
            © {currentYear} Book Reviews. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
