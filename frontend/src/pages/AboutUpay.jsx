import Navbar from '../components/Navbar';

const AboutUpay = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-heading font-extrabold text-[#333652] mb-8 text-center">
          About Upay NGO
        </h1>

        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 space-y-6">
          
          {/* Intro */}
          <div className="text-center mb-8">
            <p className="text-gray-600 italic text-lg">
              "Every child, no matter rich or poor, must have the Right to Education, Right to Health, and Right to Play"
            </p>
          </div>

          {/* About */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-[#333652] mb-4">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed">
              Upay NGO is dedicated to empowering underprivileged children across India through education, health, and holistic development. 
              Since 2011, we've been working to bridge the gap between privilege and opportunity, ensuring every child has access to quality education and a dignified childhood.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6 py-6">
            <div className="bg-[#F7AC2D]/10 rounded-2xl p-6 border-l-4 border-[#F7AC2D]">
              <h3 className="font-heading font-bold text-[#333652] mb-3">Our Vision</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                A future where every child has a dignified childhood and equal opportunity to live, learn, and grow.
              </p>
            </div>
            <div className="bg-[#2DBF91]/10 rounded-2xl p-6 border-l-4 border-[#2DBF91]">
              <h3 className="font-heading font-bold text-[#333652] mb-3">Our Mission</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                To develop a sustainable ecosystem for underprivileged communities through education and empowerment.
              </p>
            </div>
          </div>

          {/* Partnership */}
          <div className="bg-gradient-to-r from-[#333652] to-[#2DBF91] rounded-2xl p-8 text-white text-center mt-8">
            <p className="text-lg mb-4">
              Petal is proudly powered by Upay NGO, bringing health education and empowerment to young people.
            </p>
            <a 
              href="https://upayngo.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#333652] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all"
            >
              Visit Upay Website →
            </a>
          </div>

        </div>
      </main>

    </div>
  );
};

export default AboutUpay;
