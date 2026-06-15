import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'react-feather';
import Loader2 from './Loader2';

const categories = [
  { value: 'residential', label: 'Bespoke Seating' },
  { value: 'window', label: 'Window Dressings' },
  { value: 'bedroom', label: 'Beds & Accents' },
  { value: 'automotive', label: 'Car Seat Covers' },
];

export default function InquiryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, category, description }),
      });
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-[#2C1810] py-12">
      <h2 className="text-3xl font-CormorantGaramond text-[#C9A84C] mb-4">Inquiry Form</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-Jost text-[#FAF5E9] mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full p-2 bg-[#FAF5E9] border border-[#2C1810] rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-Jost text-[#FAF5E9] mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full p-2 bg-[#FAF5E9] border border-[#2C1810] rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-Jost text-[#FAF5E9] mb-2" htmlFor="phone">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full p-2 bg-[#FAF5E9] border border-[#2C1810] rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-Jost text-[#FAF5E9] mb-2" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full p-2 bg-[#FAF5E9] border border-[#2C1810] rounded"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-Jost text-[#FAF5E9] mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full p-2 bg-[#FAF5E9] border border-[#2C1810] rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-Jost text-[#FAF5E9] bg-[#C9A84C] rounded"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? <Loader2 /> : 'Submit'}
        </button>
        {status === 'success' && (
          <div className="mt-4 text-sm font-Jost text-[#FAF5E9]">
            <CheckCircle size={20} className="mr-2" />
            Inquiry sent successfully!
          </div>
        )}
        {status === 'error' && (
          <div className="mt-4 text-sm font-Jost text-[#FAF5E9]">
            <AlertCircle size={20} className="mr-2" />
            Error sending inquiry. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}
