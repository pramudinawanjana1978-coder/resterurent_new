import React, { useEffect, useState } from 'react';

const ViewFeedbacks = ({ onBack, onViewWriteReview, accentColor = "#ff9800" }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Database එකෙන් feedback දත්ත ටික ලබා ගැනීම
  useEffect(() => {
    fetch('http://localhost:5000/api/feedback')
      .then(res => res.json())
      .then(data => {
        setFeedbacks(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching feedbacks:", err);
        setLoading(false);
      });
  }, []);

  // කලින් කතා කරපු විදිහට safe check එකක් දමා වඩාත් ආරක්ෂිත කර ඇත
  const safeFeedbacks = feedbacks || [];
  const totalReviews = safeFeedbacks.length;
  
  const getRatingValue = (f) => (typeof f.rating === 'number' ? f.rating : f.stars) || 0;

  // සැබෑ දත්ත අනුව සාමාන්‍ය අගය (Average Rating) සෙවීම (දශමස්ථාන 1කට සකසා ඇත)
  const averageRating = totalReviews 
    ? (safeFeedbacks.reduce((sum, f) => sum + getRatingValue(f), 0) / totalReviews).toFixed(1) 
    : "0.0";

  // සැබෑ දත්ත අනුව සතුටුදායක ප්‍රතිශතය (Happy %) සෙවීම
  const happyPercent = totalReviews 
    ? Math.round((safeFeedbacks.filter(f => getRatingValue(f) >= 4).length / totalReviews) * 100) 
    : 0;

  // 2. දින වකවානු ලස්සනට පෙන්වන්න පොඩි උපකාරක ශ්‍රිතයක් (Function)
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Sometime ago";
    const now = new Date();
    const past = new Date(dateString);
    const diffTime = Math.abs(now - past);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    return `${diffDays} days ago`;
  };

  // 3. Rating එක අනුව තරු (Stars) පෙන්වන්න ශ්‍රිතයක්
  const renderStars = (rating) => {
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#ffb400' : '#e0e0e0', fontSize: '16px', marginLeft: '2px' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px', color: '#666', fontFamily: "sans-serif" }}>Loading reviews...</div>;
  }

  return (
    <div style={{ flex: 1, backgroundColor: '#faf8f5', overflowY: 'auto', height: '100vh', fontFamily: "'Trebuchet MS', sans-serif" }}>
      
      {/* ─── HEADER SECTION ─── */}
      <div style={{ backgroundColor: '#0f2042', color: '#fff', padding: '40px 32px 30px', position: 'relative' }}>
        <button 
          onClick={onBack} 
          style={{ position: 'absolute', top: 20, left: 32, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '20px', color: '#fff', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
        >
          ← Home
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '15px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#f5a623', letterSpacing: '1px', textTransform: 'uppercase' }}>Share Your Experience</span>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '6px 0 8px' }}>How was your meal? 💬</h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Your honest feedback helps us cook better for you every single day.</p>
          </div>

          {/* Stats Badges — සැබෑ දත්ත අනුව වෙනස් වන ලෙස සකසා ඇත */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '12px 20px', textAlign: 'center', minWidth: '75px' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffb400' }}>★ {averageRating}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Overall</div>
            </div>
            
            {/* 2,400+ වෙනුවට සැබෑ මුළු feedbacks ගණන (totalReviews) මෙතනට ආදේශ කර ඇත */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '12px 20px', textAlign: 'center', minWidth: '75px' }}>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{totalReviews}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Reviews</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '12px 20px', textAlign: 'center', minWidth: '75px' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#4caf50' }}>{happyPercent}%</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Happy</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '35px' }}>
          <button 
            onClick={onViewWriteReview} 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
          >
            🌟 All Reviews
          </button>
        </div>
      </div>

      {/* ─── REVIEWS LIST ─── */}
      <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {safeFeedbacks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '20px', color: '#888' }}>
            No reviews database records found. Be the first to leave a review!
          </div>
        ) : (
          safeFeedbacks.map((fb) => (
            <div 
              key={fb._id} 
              style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', display: 'flex', gap: '16px', border: '1px solid rgba(0,0,0,0.03)' }}
            >
              {/* Avatar section */}
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f0e6df', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                {fb.name && fb.name.length % 2 === 0 ? "👩" : "🧑"}
              </div>

              {/* Review Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>
                      {fb.name || "Anonymous Customer"}
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#999' }}>
                      {formatTimeAgo(fb.createdAt)} • ordered <span style={{ fontWeight: 600, color: '#555' }}>{fb.dishName || "Delicious Dish"}</span>
                    </p>
                  </div>
                  {/* Stars display */}
                  <div style={{ display: 'flex' }}>
                    {renderStars(getRatingValue(fb))}
                  </div>
                </div>

                <p style={{ margin: '14px 0 0', fontSize: '14px', color: '#444', lineHeight: 1.6 }}>
                  {fb.comment}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ViewFeedbacks;