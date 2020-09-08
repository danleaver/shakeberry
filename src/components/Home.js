import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Home = () => {
  const [data, setData] = useState([])
  
  useEffect(() => {  
    let mounted = true;
    let retry = 5
    
    console.log("START:", new Date())

    const fetchData = () => {
      axios.get('/api/shakerdata.txt')
        .then(res => {
          if (mounted) {
            retry = 5
            setData(res.data)
            setTimeout(() => {
              fetchData()
            }, 1000); 
          }
        })
        .catch(err => {
          console.log(err)
          retry --
          console.log("CONNECTION FAILED, RETRYING IN 5 SECONDS, RETRIES REMAINING:", retry)
          
          if (retry > 0 ) {
            setTimeout(() => {
              fetchData()
            }, 5000)
          } else {
            console.log("CONNECTION TO SERVER HAS FAILED PLEASE REFRESH")
            console.log( new Date(), '<---END')
          }
        })   
    }

    fetchData()

    return () => mounted = false
  }, [])
  

  return (
    <Wrapper>
      { data.map( (item, i) => (
        <Flex key={i}>
          <StyledDiv isLabel={true}>
            {item.label}
          </StyledDiv>
          <StyledDiv>
            {item.value}
          </StyledDiv>
        </Flex>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 1rem 0.5rem;
`
const Flex = styled.div`
  padding: 0.5rem 1rem;
  font-size: 2rem;
`
const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isLabel ? "#d9d9d9" : "#92d150"};
  padding: ${props => props.isLabel ? "0.25rem" : "0.5rem"};
`

export default Home