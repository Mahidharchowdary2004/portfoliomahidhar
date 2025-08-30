import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const API_BASE = 'https://portfoliomahidhar-backend.onrender.com';
const AUTH_TOKEN = 'mahi@123';

const SkillsAdmin = () => {
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/skills`).then(res => res.json()).then(setSkills);
  }, []);

  const updateSkill = (index, field, value) => {
    setSkills(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const saveData = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_BASE}/skills`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(skills),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Failed to save Skills`);
      }
      setSuccess(`Skills saved successfully!`);
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    setSkills(prev => [...prev, { title: '', icon: '', skills: '' }]);
  };

  return (
    <div className="mb-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Panel - Skills</h1>
      {skills.map((skill, index) => (
        <div key={index} className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" value={skill.title} onChange={e => updateSkill(index, 'title', e.target.value)} placeholder="Skill Title" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input type="text" value={skill.icon} onChange={e => updateSkill(index, 'icon', e.target.value)} placeholder="Icon name (e.g., cpu, code2)" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            <input type="text" value={skill.skills} onChange={e => updateSkill(index, 'skills', e.target.value)} placeholder="Skills (comma-separated)" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
        </div>
      ))}
      <div className="flex items-center space-x-4">
        <button onClick={addSkill} className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition">Add Skill</button>
        <button onClick={saveData} disabled={isSaving} className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Skills'}</button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
};

export default SkillsAdmin; 