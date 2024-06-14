import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Footer from '../components/Footer';

const FeaturePageContainer = styled.div`
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 160px;
  height: auto;
  background-color: #f0f0f0;
  padding: 20px;
  border-right: 1px solid #000000;
`;

const SidebarLinkContainer = styled.div`
  margin-bottom: 10px;
`;

const SidebarLink = styled(Link)`
  display: block;
  color: #333;
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  border: 1px solid #000000;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #e0f7fa;
  }
`;

const SidebarLinkActive = styled(Link)`
  display: block;
  color: #333;
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #000000;
  background-color: #e8f4d9;
  cursor: pointer;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ActivityContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const ActivityItem = styled.div`
  padding: 20px;
  border: 1px solid #000000;
  border-radius: 5px;
  background-color: #fff;
`;

const ActivityType = styled.div`
  font-weight: bold;
`;

const ActivityInputLabel = styled.div`
  margin-top: 10px;
  font-weight: bold;
`;

const ActivityInput = styled.div`
  margin-top: 10px;
`;

const ActivityOutputLabel = styled.div`
  margin-top: 10px;
  font-weight: bold;
`;

const ActivityOutput = styled.div`
  margin-top: 5px;
  white-space: pre-wrap; /* Preserves line breaks */
`;

const NoActivityMessage = styled.p`
  color: #777;
  font-style: italic;
  text-align: center;
`;

const DeleteButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #ff1a1a;
  }
`;

const Dashboard = ({ user }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:3080/api/activity/${user.name}`);
          setActivities(response.data);
        } catch (error) {
          console.error('Error fetching activities:', error);
        }
      }
    };

    fetchActivities();
  }, [user]);

  const handleDeleteActivities = async () => {
    if (user) {
      try {
        await axios.delete(`http://localhost:3080/api/activity/${user.name}`);
        setActivities([]);
      } catch (error) {
        console.error('Error deleting activities:', error);
      }
    }
  };

  const renderOutputWithLinks = (output) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const formattedOutput = output.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`);
    return formattedOutput.replace(/\n/g, '<br/>');
  };

  return (
    <FeaturePageContainer>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Sidebar>
          <SidebarLinkContainer>
            <SidebarLink to="/grammar-checker">Grammar Checker</SidebarLink>
          </SidebarLinkContainer>
          <SidebarLinkContainer>
            <SidebarLink to="/plagiarism-checker">Plagiarism Checker</SidebarLink>
          </SidebarLinkContainer>
          <SidebarLinkContainer>
            <SidebarLink to="/text-completion">Text Completion</SidebarLink>
          </SidebarLinkContainer>
          <SidebarLinkContainer>
            <SidebarLink to="/paraphraser">Paraphraser</SidebarLink>
          </SidebarLinkContainer>
          <SidebarLinkContainer>
            <SidebarLinkActive to="/dashboard">Dashboard</SidebarLinkActive>
          </SidebarLinkContainer>
        </Sidebar>
        <MainContent>
          <h1>Recent Activities</h1>
          <ActivityContainer>
            {activities.length === 0 ? (
              <NoActivityMessage>No recent activity.</NoActivityMessage>
            ) : (
              activities.map((activity, index) => (
                <ActivityItem key={index}>
                  <ActivityType>Type: {activity.activity_type}</ActivityType>
                  <ActivityInputLabel>Input:</ActivityInputLabel>
                  <ActivityInput>{activity.input_text}</ActivityInput>
                  <ActivityOutputLabel>Output:</ActivityOutputLabel>
                  <ActivityOutput dangerouslySetInnerHTML={{ __html: renderOutputWithLinks(activity.output_text) }} />
                </ActivityItem>
              ))
            )}
          </ActivityContainer>
          {activities.length > 0 && (
            <DeleteButton onClick={handleDeleteActivities}>Delete All Activities</DeleteButton>
          )}
        </MainContent>
      </div>
      <Footer />
    </FeaturePageContainer>
  );
};

export default Dashboard;
