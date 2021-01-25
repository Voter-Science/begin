import * as React from "react";
import styled from "@emotion/styled";

interface IProps {
  content: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  url?: React.ReactNode;
}

const Card = styled.div`
  text-align: center;
`;

const Icon = styled.div`
  font-size: 4rem;
`;

const Url = styled.div`
  a {
    background: #6485ff;
    border-radius: 2px;
    color: #fff;
    display: block;
    padding: .8rem 0.5rem;
    text-decoration: none;
  }
`;

const Title = styled.h3`
  font-size: 17px;
`;

const Content = styled.div`
  font-size: 15px;
  margin-top: 1rem;
  > *:first-child {
    margin-top: 0;
  }
  > *:last-child {
    margin-bottom: 0;
  }
`;

export const PluginCard = ({ content, icon, title, url }: IProps) => {
  return (
    <Card>
      <Icon>{icon}</Icon>
      <Title>{title}</Title>
      {url && <Url>{url}</Url>}
      <Content>{content}</Content>
    </Card>
  );
};

export const CardGrid = styled.div`
  display: grid;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin: 2rem 0;
`;
