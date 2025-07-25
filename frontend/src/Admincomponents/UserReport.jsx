import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import 'chart.js/auto';


const UserReport = () => {
  const [report, setReport] = useState([]);
  const [auth] = useState(JSON.parse(localStorage.getItem('tourstorage')));
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    if (!auth || !auth.vendorid) {
      console.error("Invalid user auth");
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        const res = await fetch('http://localhost:4000/multivendor/user', {
          method: 'POST',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: auth.vendorid }),
        });

        const result = await res.json();
        setReport(result);
        setTimeout(() => setAnimateStats(true), 500);
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [auth]);

  // 🧠 Analytics
  const scores = report.map(r => r.score);
  const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 0;
  const min = scores.length ? Math.min(...scores) : 0;
  const max = scores.length ? Math.max(...scores) : 0;

  let trend = "Insufficient data";
  let trendIcon = "📊";
  let trendColor = "#6b7280";

  if (scores.length >= 2) {
    const diff = scores[scores.length - 1] - scores[0];
    if (diff > 1) {
      trend = "Improving";
      trendIcon = "📈";
      trendColor = "#10b981";
    } else if (diff < -1) {
      trend = "Declining";
      trendIcon = "📉";
      trendColor = "#ef4444";
    } else {
      trend = "Stable";
      trendIcon = "📊";
      trendColor = "#f59e0b";
    }
  }

  const getLearningPlan = () => {
    if (avg < 4) {
      return [
        { icon: "🔁", text: "Review basic concepts: percentages, ratios, averages.", priority: "high" },
        { icon: "📘", text: "Study for 30 minutes daily using beginner aptitude material.", priority: "high" },
        { icon: "✍️", text: "Practice 5-10 beginner questions each day.", priority: "medium" },
        { icon: "💡", text: "Revisit questions you got wrong and study the explanations.", priority: "medium" }
      ];
    } else if (avg < 7) {
      return [
        { icon: "🧠", text: "Take sectional mock tests regularly.", priority: "high" },
        { icon: "⏱️", text: "Focus on speed using 10-minute mini-tests.", priority: "high" },
        { icon: "🧾", text: "Analyze wrong answers and track accuracy.", priority: "medium" },
        { icon: "🛠️", text: "Practice intermediate-level reasoning and math questions.", priority: "medium" }
      ];
    } else {
      return [
        { icon: "📚", text: "Attempt full-length mock tests weekly.", priority: "high" },
        { icon: "🎯", text: "Focus on time management and accuracy.", priority: "high" },
        { icon: "📊", text: "Start solving high-difficulty logical puzzles and DI sets.", priority: "medium" },
        { icon: "💬", text: "Participate in aptitude forums and discussions.", priority: "low" }
      ];
    }
  };

  const getPerformanceLevel = () => {
    if (avg < 4) return { level: "Beginner", color: "#ef4444", progress: 25 };
    if (avg < 7) return { level: "Intermediate", color: "#f59e0b", progress: 60 };
    return { level: "Advanced", color: "#10b981", progress: 90 };
  };

  const chartData = {
    labels: report.map((r, i) => `Test ${i + 1}`),
    datasets: [
      {
        label: "Score",
        data: scores,
        borderColor: "#667eea",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#667eea",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#667eea',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
        beginAtZero: true,
      },
    },
  };

  const performance = getPerformanceLevel();

  const styles = {
    container: {
      // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      background: "white",
      minHeight: "100vh",
      padding: "2rem",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },

    card: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      maxWidth: "1200px",
      margin: "0 auto",
      overflow: "hidden",
    },

    header: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "2rem",
      textAlign: "center",
    },

    title: {
      fontSize: "2.5rem",
      fontWeight: "700",
      margin: "0 0 0.5rem 0",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },

    subtitle: {
      fontSize: "1.1rem",
      opacity: 0.9,
      margin: 0,
    },

    tabContainer: {
      display: "flex",
      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      background: "rgba(255, 255, 255, 0.5)",
    },

    tab: {
      flex: 1,
      padding: "1rem 2rem",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
      position: "relative",
    },

    activeTab: {
      color: "#667eea",
      background: "rgba(102, 126, 234, 0.1)",
    },

    content: {
      padding: "2rem",
    },

    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem",
    },

    statCard: {
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)",
      padding: "1.5rem",
      borderRadius: "16px",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },

    statIcon: {
      fontSize: "2rem",
      marginBottom: "0.5rem",
      display: "block",
    },

    statValue: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#1f2937",
      margin: "0.5rem 0",
      transition: "all 0.5s ease",
    },

    statLabel: {
      fontSize: "0.9rem",
      color: "#6b7280",
      fontWeight: "500",
    },

    chartContainer: {
      background: "rgba(255, 255, 255, 0.8)",
      borderRadius: "16px",
      padding: "1.5rem",
      marginBottom: "2rem",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(10px)",
      height: "400px",
    },

    progressContainer: {
      background: "rgba(255, 255, 255, 0.8)",
      borderRadius: "16px",
      padding: "1.5rem",
      marginBottom: "2rem",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(10px)",
    },

    progressBar: {
      width: "100%",
      height: "12px",
      background: "rgba(0, 0, 0, 0.1)",
      borderRadius: "6px",
      overflow: "hidden",
      marginTop: "1rem",
    },

    progressFill: {
      height: "100%",
      background: `linear-gradient(90deg, ${performance.color}, ${performance.color}dd)`,
      borderRadius: "6px",
      transition: "width 1s ease-out",
      width: animateStats ? `${performance.progress}%` : "0%",
    },

    planContainer: {
      background: "rgba(255, 255, 255, 0.8)",
      borderRadius: "16px",
      padding: "1.5rem",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(10px)",
    },

    planItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "1rem",
      padding: "1rem",
      marginBottom: "0.5rem",
      borderRadius: "12px",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },

    planIcon: {
      fontSize: "1.5rem",
      flexShrink: 0,
    },

    planText: {
      flex: 1,
      color: "#374151",
      lineHeight: "1.5",
    },

    priorityBadge: {
      padding: "0.25rem 0.75rem",
      borderRadius: "12px",
      fontSize: "0.75rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },

    loading: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "4rem",
      color: "#6b7280",
    },

    loadingSpinner: {
      width: "40px",
      height: "40px",
      border: "4px solid rgba(102, 126, 234, 0.2)",
      borderTop: "4px solid #667eea",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "1rem",
    },

    emptyState: {
      textAlign: "center",
      padding: "4rem",
      color: "#6b7280",
    },

    emptyIcon: {
      fontSize: "4rem",
      marginBottom: "1rem",
      opacity: 0.5,
    },
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' };
      case 'medium': return { bg: '#fffbeb', border: '#fed7aa', text: '#d97706' };
      case 'low': return { bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a' };
      default: return { bg: '#f9fafb', border: '#e5e7eb', text: '#6b7280' };
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loading}>
            <div style={styles.loadingSpinner}></div>
            <p>Loading your performance report...</p>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <button className="btn btn-light" style={{ marginLeft: "-1000px" }} onClick={() => window.history.back()}> &lt; </button>
          <h1 style={styles.title}>📊 Aptitude Performance Report</h1>
          <p style={styles.subtitle}>Track your progress and get personalized recommendations</p>
        </div>

        {/* Tabs */}
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(selectedTab === 'overview' ? styles.activeTab : {}),
            }}
            onClick={() => setSelectedTab('overview')}
          >
            📈 Overview
          </button>
          <button
            style={{
              ...styles.tab,
              ...(selectedTab === 'progress' ? styles.activeTab : {}),
            }}
            onClick={() => setSelectedTab('progress')}
          >
            📊 Progress
          </button>
          <button
            style={{
              ...styles.tab,
              ...(selectedTab === 'plan' ? styles.activeTab : {}),
            }}
            onClick={() => setSelectedTab('plan')}
          >
            📚 Learning Plan
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {report.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📝</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                No Data Available
              </h3>
              <p>Start taking tests to see your performance report here!</p>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {selectedTab === 'overview' && (
                <>
                  {/* Stats Grid */}
                  <div style={styles.statsGrid}>
                    <div
                      style={styles.statCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span style={styles.statIcon}>🎯</span>
                      <div style={styles.statValue}>{avg}</div>
                      <div style={styles.statLabel}>Average Score</div>
                    </div>

                    <div
                      style={styles.statCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span style={styles.statIcon}>⭐</span>
                      <div style={styles.statValue}>{max}</div>
                      <div style={styles.statLabel}>Best Score</div>
                    </div>

                    <div
                      style={styles.statCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span style={styles.statIcon}>{trendIcon}</span>
                      <div style={{ ...styles.statValue, color: trendColor }}>{trend}</div>
                      <div style={styles.statLabel}>Performance Trend</div>
                    </div>

                    <div
                      style={styles.statCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span style={styles.statIcon}>📝</span>
                      <div style={styles.statValue}>{report.length}</div>
                      <div style={styles.statLabel}>Tests Taken</div>
                    </div>
                  </div>

                  {/* Performance Level */}
                  <div style={styles.progressContainer}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                      🏆 Performance Level: {performance.level}
                    </h3>
                    <div style={styles.progressBar}>
                      <div style={styles.progressFill}></div>
                    </div>
                    <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                      {performance.progress}% progress to next level
                    </p>
                  </div>
                  <div>
                    <Link to='/apptitude-certificate'>
                      <button
                        style={{
                          background: "#fff",
                          border: "2px solid #fff",
                          color: "#4b5563",
                          borderRadius: "8px",
                          padding: "10px 24px",
                          fontWeight: 600,
                          fontSize: "1rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          cursor: "pointer",
                          transition: "box-shadow 0.2s"
                        }}
                      >
                        Request Apptitude Certificate
                      </button></Link>
                  </div>
                </>
              )}

              {/* Progress Tab */}
              {selectedTab === 'progress' && (
                <div style={styles.chartContainer}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                    📈 Score Progression
                  </h3>
                  <Line data={chartData} options={chartOptions} />
                </div>
              )}

              {/* Learning Plan Tab */}
              {selectedTab === 'plan' && (
                <div style={styles.planContainer}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
                    📚 Personalized Learning Plan
                  </h3>
                  {getLearningPlan().map((item, i) => {
                    const priorityStyle = getPriorityColor(item.priority);
                    return (
                      <div
                        key={i}
                        style={styles.planItem}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <span style={styles.planIcon}>{item.icon}</span>
                        <span style={styles.planText}>{item.text}</span>
                        <span
                          style={{
                            ...styles.priorityBadge,
                            background: priorityStyle.bg,
                            border: `1px solid ${priorityStyle.border}`,
                            color: priorityStyle.text,
                          }}
                        >
                          {item.priority}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserReport;