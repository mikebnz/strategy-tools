import React, { useState, useEffect } from 'react';
import { Users, Plus, Target, TrendingUp, AlertCircle, CheckCircle, Download, Mail, BarChart3 } from 'lucide-react';

const StakeholderInfluenceMapper = () => {
  const [stakeholders, setStakeholders] = useState([]);
  const [newStakeholder, setNewStakeholder] = useState({
    name: '',
    title: '',
    department: '',
    influence: 5,
    support: 5,
    engagement: 3,
    relationship: 'new'
  });
  const [analysis, setAnalysis] = useState(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  });

  const departments = ['Executive', 'IT', 'Finance', 'Operations', 'Legal', 'Procurement', 'Other'];
  const relationships = ['champion', 'supporter', 'neutral', 'skeptic', 'blocker', 'new'];

  const addStakeholder = () => {
    if (newStakeholder.name && newStakeholder.title) {
      setStakeholders([...stakeholders, { ...newStakeholder, id: Date.now() }]);
      setNewStakeholder({
        name: '',
        title: '',
        department: '',
        influence: 5,
        support: 5,
        engagement: 3,
        relationship: 'new'
      });
    }
  };

  const removeStakeholder = (id) => {
    setStakeholders(stakeholders.filter(s => s.id !== id));
  };

  const updateStakeholder = (id, field, value) => {
    setStakeholders(stakeholders.map(s => 
      s.id === id ? { ...s, [field]: field.includes('influence') || field.includes('support') || field.includes('engagement') ? parseInt(value) : value } : s
    ));
  };

  const getInfluenceColor = (influence) => {
    if (influence >= 8) return 'bg-red-500';
    if (influence >= 6) return 'bg-orange-500';
    if (influence >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getSupportColor = (support) => {
    if (support >= 7) return 'text-green-600';
    if (support >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRelationshipIcon = (relationship) => {
    switch(relationship) {
      case 'champion': return <CheckCircle className="text-green-600 w-4 h-4" />;
      case 'supporter': return <TrendingUp className="text-green-500 w-4 h-4" />;
      case 'neutral': return <Target className="text-yellow-500 w-4 h-4" />;
      case 'skeptic': return <AlertCircle className="text-orange-500 w-4 h-4" />;
      case 'blocker': return <AlertCircle className="text-red-600 w-4 h-4" />;
      default: return <Users className="text-gray-500 w-4 h-4" />;
    }
  };

  const generateReport = () => {
    if (stakeholders.length < 3) {
      alert('Please add at least 3 stakeholders to generate a meaningful report.');
      return;
    }
    setShowLeadCapture(true);
  };

  const downloadReport = () => {
    const reportData = {
      date: new Date().toISOString().split('T')[0],
      stakeholders: stakeholders,
      analysis: analysis,
      contact: leadData
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stakeholder-analysis-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    setShowLeadCapture(false);
    setLeadData({ name: '', email: '', company: '', phone: '' });
  };

  const submitLeadForm = () => {
    if (!leadData.name || !leadData.email) {
      alert('Please fill in your name and email');
      return;
    }
    
    console.log('Lead captured:', leadData);
    downloadReport();
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'report_generated', {
        event_category: 'engagement',
        event_label: 'stakeholder_mapper'
      });
    }
  };

  useEffect(() => {
    if (stakeholders.length > 0) {
      const avgInfluence = stakeholders.reduce((sum, s) => sum + s.influence, 0) / stakeholders.length;
      const avgSupport = stakeholders.reduce((sum, s) => sum + s.support, 0) / stakeholders.length;
      const highInfluence = stakeholders.filter(s => s.influence >= 7);
      const supporters = stakeholders.filter(s => s.support >= 6);
      const risks = stakeholders.filter(s => s.influence >= 7 && s.support <= 4);
      
      setAnalysis({
        avgInfluence: avgInfluence.toFixed(1),
        avgSupport: avgSupport.toFixed(1),
        highInfluence: highInfluence.length,
        supporters: supporters.length,
        risks: risks.length,
        recommendations: generateRecommendations(stakeholders)
      });
    } else {
      setAnalysis(null);
    }
  }, [stakeholders]);

  const generateRecommendations = (stakeholders) => {
    const recommendations = [];
    
    const champions = stakeholders.filter(s => s.relationship === 'champion' && s.influence >= 7);
    const highInfluenceSkeptics = stakeholders.filter(s => s.influence >= 7 && s.support <= 4);
    const lowEngagement = stakeholders.filter(s => s.engagement <= 2 && s.influence >= 5);
    
    if (champions.length === 0) {
      recommendations.push("Priority: Identify and cultivate champions among high-influence stakeholders");
    }
    
    if (highInfluenceSkeptics.length > 0) {
      recommendations.push(`Critical: Address concerns of ${highInfluenceSkeptics.length} high-influence skeptic(s)`);
    }
    
    if (lowEngagement.length > 0) {
      recommendations.push(`Action: Increase engagement with ${lowEngagement.length} influential but under-engaged stakeholder(s)`);
    }
    
    if (stakeholders.filter(s => s.department === 'Executive').length === 0) {
      recommendations.push("Consider: Add executive-level stakeholders to your mapping");
    }
    
    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">StrategAI Tools</h1>
                <p className="text-sm text-gray-600">Stakeholder Influence Mapper</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Powered by 30+ years of enterprise sales experience</p>
              <p className="text-xs text-gray-500">mike@wn.co.nz | +64 27 449 6200</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Stakeholder Influence Mapper</h2>
              <p className="text-gray-600">Map stakeholder influence and develop winning engagement strategies</p>
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-blue-800">
              <strong>Based on proven methodology:</strong> Used to win New Zealand's largest managed services contract and lead multi-party consortiums across government and enterprise sectors.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Stakeholder</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              value={newStakeholder.name}
              onChange={(e) => setNewStakeholder({...newStakeholder, name: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Title"
              value={newStakeholder.title}
              onChange={(e) => setNewStakeholder({...newStakeholder, title: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newStakeholder.department}
              onChange={(e) => setNewStakeholder({...newStakeholder, department: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <button
              onClick={addStakeholder}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Stakeholder
            </button>
          </div>
        </div>

        {stakeholders.length > 0 && (
          <div className="space-y-4 mb-6">
            {stakeholders.map((stakeholder) => (
              <div key={stakeholder.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {getRelationshipIcon(stakeholder.relationship)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{stakeholder.name}</h3>
                      <p className="text-gray-600">{stakeholder.title} - {stakeholder.department}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeStakeholder(stakeholder.id)}
                    className="text-red-500 hover:text-red-700 px-3 py-1 text-sm border border-red-300 rounded hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Influence (1-10)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={stakeholder.influence}
                        onChange={(e) => updateStakeholder(stakeholder.id, 'influence', e.target.value)}
                        className="flex-1"
                      />
                      <span className={`w-8 h-8 rounded-full ${getInfluenceColor(stakeholder.influence)} flex items-center justify-center text-white text-sm font-bold`}>
                        {stakeholder.influence}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support (1-10)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={stakeholder.support}
                        onChange={(e) => updateStakeholder(stakeholder.id, 'support', e.target.value)}
                        className="flex-1"
                      />
                      <span className={`font-bold ${getSupportColor(stakeholder.support)} text-lg`}>
                        {stakeholder.support}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Engagement (1-5)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={stakeholder.engagement}
                        onChange={(e) => updateStakeholder(stakeholder.id, 'engagement', e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 font-medium">{stakeholder.engagement}/5</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship
                    </label>
                    <select
                      value={stakeholder.relationship}
                      onChange={(e) => updateStakeholder(stakeholder.id, 'relationship', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {relationships.map(rel => (
                        <option key={rel} value={rel}>{rel.charAt(0).toUpperCase() + rel.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Influence Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Average Influence:</span>
                  <span className="font-bold text-blue-900">{analysis.avgInfluence}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">High Influence (7+):</span>
                  <span className="font-bold text-blue-900">{analysis.highInfluence} stakeholders</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Average Support:</span>
                  <span className="font-bold text-blue-900">{analysis.avgSupport}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Supporters (6+):</span>
                  <span className="font-bold text-green-600">{analysis.supporters} stakeholders</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">High-Risk:</span>
                  <span className="font-bold text-red-600">{analysis.risks} stakeholders</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Strategic Recommendations
              </h3>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-green-800">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {stakeholders.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-3">Ready for Strategic Insights?</h3>
            <p className="text-gray-600 mb-4">
              Generate a comprehensive stakeholder analysis report based on Mike Bullock's proven methodology
            </p>
            <button
              onClick={generateReport}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
            >
              <Download className="w-5 h-5" />
              Generate Strategic Report
            </button>
          </div>
        )}

        {showLeadCapture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Get Your Strategic Analysis Report</h3>
              <p className="text-gray-600 mb-4">
                Enter your details to receive your personalized stakeholder influence analysis
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={leadData.name}
                  onChange={(e) => setLeadData({...leadData, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={leadData.email}
                  onChange={(e) => setLeadData({...leadData, email: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={leadData.company}
                  onChange={(e) => setLeadData({...leadData, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone (Optional)"
                  value={leadData.phone}
                  onChange={(e) => setLeadData({...leadData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowLeadCapture(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submitLeadForm}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Get Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold">StrategAI</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Where 30+ years of proven enterprise sales leadership meets AI-powered strategy
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                mike@wn.co.nz
              </span>
              <span>+64 27 449 6200</span>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Based on methodology used to win New Zealand's largest managed services contracts
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StakeholderInfluenceMapper;