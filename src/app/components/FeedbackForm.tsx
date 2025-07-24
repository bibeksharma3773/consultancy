'use client'
import { useState } from 'react';
import Head from 'next/head';

const GetStartedPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    educationLevel: '',
    studyDestination: '',
    programInterest: '',
    intakeYear: '2024',
    intakeSeason: 'Fall',
    englishProficiency: '',
    budget: '20000',
    notes: ''
  });

  // FIX: Added the correct TypeScript type for the 'e' parameter.
  // This is the specific change that resolves the build error shown in your log.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // FIX: Added the correct TypeScript type for the form submission event.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Form submitted successfully!');
    // In a real app, you would send the data to your backend
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Get Started with ApplyBoard</title>
        <meta name="description" content="Start your study abroad journey" />
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Start Your Study Abroad Journey</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Complete our simple form to get matched with programs that fit your goals
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-12">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              {num > 1 && <div className={`h-1 flex-1 ${step >= num ? 'bg-blue-600' : 'bg-gray-300'}`}></div>}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                ${step === num ? 'bg-blue-600 text-white border-4 border-blue-300' : 
                  step > num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {num}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm font-medium">
          <span className={step === 1 ? 'text-blue-600' : 'text-gray-600'}>Personal Info</span>
          <span className={step === 2 ? 'text-blue-600' : 'text-gray-600'}>Education</span>
          <span className={step === 3 ? 'text-blue-600' : 'text-gray-600'}>Preferences</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 sm:p-8">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                  <p className="text-gray-600">Tell us about yourself so we can personalize your experience.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1 (123) 456-7890"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country of Citizenship *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select your country</option>
                      <option value="india">India</option>
                      <option value="china">China</option>
                      <option value="nigeria">Nigeria</option>
                      <option value="brazil">Brazil</option>
                      <option value="vietnam">Vietnam</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* Step 2: Education Background */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Education Background</h2>
                  <p className="text-gray-600">Help us understand your academic history and goals.</p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Highest Level of Education *</label>
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select your education level</option>
                      <option value="high_school">High School</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="phd">PhD</option>
                      <option value="diploma">Diploma/Certificate</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Desired Study Destination *</label>
                    <select
                      name="studyDestination"
                      value={formData.studyDestination}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select your destination</option>
                      <option value="canada">Canada</option>
                      <option value="usa">United States</option>
                      <option value="uk">United Kingdom</option>
                      <option value="australia">Australia</option>
                      <option value="germany">Germany</option>
                      <option value="france">France</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program of Interest *</label>
                    <select
                      name="programInterest"
                      value={formData.programInterest}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select program interest</option>
                      <option value="business">Business & Management</option>
                      <option value="engineering">Engineering</option>
                      <option value="computer_science">Computer Science & IT</option>
                      <option value="health">Health Sciences</option>
                      <option value="arts">Arts & Design</option>
                      <option value="social_sciences">Social Sciences</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* Step 3: Preferences */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Study Preferences</h2>
                  <p className="text-gray-600">Tell us more about your study preferences.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Intake Year *</label>
                      <select
                        name="intakeYear"
                        value={formData.intakeYear}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Intake Season *</label>
                      <select
                        name="intakeSeason"
                        value={formData.intakeSeason}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="fall">Fall</option>
                        <option value="winter">Winter</option>
                        <option value="spring">Spring</option>
                        <option value="summer">Summer</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">English Proficiency</label>
                    <select
                      name="englishProficiency"
                      value={formData.englishProficiency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select your proficiency</option>
                      <option value="ielts">IELTS</option>
                      <option value="toefl">TOEFL</option>
                      <option value="pte">PTE</option>
                      <option value="duolingo">Duolingo</option>
                      <option value="none">Not taken yet</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Annual Budget (USD) *
                    </label>
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-600">$</span>
                      <input
                        type="range"
                        name="budget"
                        min="5000"
                        max="50000"
                        step="5000"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full"
                      />
                      <span className="ml-2 font-medium">${formData.budget}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Move the slider to indicate your budget for tuition and living expenses
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes or Questions
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us anything else we should know..."
                    ></textarea>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="mt-10 flex flex-col-reverse sm:flex-row sm:justify-between gap-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </div>
            
            {/* Form Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                By submitting this form, you agree to our <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and 
                consent to being contacted by ApplyBoard and our partner institutions.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Apply with Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Free Application Support</h3>
            <p className="text-gray-600">Our experts guide you through every step of the application process at no cost to you.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Access to 1,500+ Institutions</h3>
            <p className="text-gray-600">We partner with top universities and colleges across Canada, the US, UK, and more.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Scholarship Opportunities</h3>
            <p className="text-gray-600">Get matched with scholarship options to make your education more affordable.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;
