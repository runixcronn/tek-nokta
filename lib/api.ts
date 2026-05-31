import type { Property, Agent, Testimonial, City } from './data';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export async function fetchProperties(): Promise<Property[]> {
  const res = await fetch(`${BASE_URL}/api/properties`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
}

export async function fetchAgents(): Promise<Agent[]> {
  const res = await fetch(`${BASE_URL}/api/agents`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch agents');
  return res.json();
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(`${BASE_URL}/api/testimonials`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch testimonials');
  return res.json();
}

export async function fetchCities(): Promise<City[]> {
  const res = await fetch(`${BASE_URL}/api/cities`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch cities');
  return res.json();
}
