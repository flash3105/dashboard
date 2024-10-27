import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../components/Faq.css';

function History() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize the navigate hook

  const searchQuery = location.state?.query || ''; // Get search query from Header.js

  const [faqs] = useState([
    {
      question: "How do I select a place and ISP on the dashboard?",
      answer: "To select a place, simply use the dropdown menu to choose your location. Once selected, the ISP dropdown will be enabled, allowing you to pick an Internet Service Provider from the chosen place.",
      open: false
    },
    {
      question: "What does the speedometer represent, and how is the speed calculated?",
      answer: "The speedometer displays the latest MeanThroughput for the selected ISP and location. The speed is calculated as the average download or upload speed over recent data points.",
      open: false
    },
    {
      question: "How do I change the metric from download speed to upload speed?",
      answer: "You can change the metric by selecting either 'download speed', 'upload speed', or 'average speed' from the dropdown on the dashboard. The default is download speed.",
      open: false
    },
    {
      question: "Can I compare network performance for different locations?",
      answer: "Yes, after selecting one location and ISP, you can add another location and compare the two places on the map and in the graph. The graph will display both sets of data side by side.",
      open: false
    },
    {
      question: "How is historical data visualized, and can I download the graphs?",
      answer: "Historical data is visualized using line graphs. You can download these graphs by clicking the 'Download' button available on the dashboard.",
      open: false
    },
    {
      question: "What does the map display, and how do I navigate through it?",
      answer: "The map shows the selected place and surrounding areas. You can zoom in or out and move around using standard map controls to explore nearby locations.",
      open: false
    },
    {
      question: "How often is the network data updated?",
      answer: "Network data is updated in near real-time. However, the frequency of updates depends on the availability of new data from our data sources.",
      open: false
    },
    {
      question: "What are the top ISPs in my area, and how are they ranked?",
      answer: "You can view the top 10 ISPs in your selected area on the 'Overview' page. The ISPs are ranked based on their average performance metrics, such as download and upload speeds.",
      open: false
    },
    {
      question: "How is the data sourced, and what is the accuracy of the measurements?",
      answer: "The data is sourced from public and third-party providers, including M-Lab and Ripe Atlas, which provide real-time and historical network performance data. We ensure the data's accuracy through extensive validation processes.",
      open: false
    },
    {
      question: "How do I reset or clear my selections on the dashboard?",
      answer: "You can reset your selections by clicking the 'Clear' button on the dashboard, which will allow you to start fresh with new metrics, places, and ISPs.",
      open: false
    }
  ]);

  const [filteredFaqs, setFilteredFaqs] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      const results = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFaqs(results);
    } else {
      setFilteredFaqs(faqs);
    }
  }, [searchQuery, faqs]);

  const toggleFAQ = (index) => {
    setFilteredFaqs(
      filteredFaqs.map((faq, i) => {
        if (i === index) {
          faq.open = !faq.open;
        } else {
          faq.open = false;
        }
        return faq;
      })
    );
  };

  return (
    <div className="faq-container">
      <h3>Frequently Asked Questions</h3>
      
      <div className="faqs">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div key={index} className={`faq ${faq.open ? 'open' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
              </div>
              <div className="faq-answer">
                {faq.open && <p>{faq.answer}</p>}
               
              </div>
              
            </div>
              
          ))
        ) : (
          <p>No FAQs found for "{searchQuery}"</p>
        )}
        {/* Back button to navigate to the previous page */}
        <button className="back-button" onClick={() => navigate(-1)}>
                  Back
                </button>
      </div>
    </div>
  );
}

export default History;
