import { Avatar } from '@chakra-ui/react'
import React from 'react'
import { Box,Text } from '@chakra-ui/react'

const UserListItem = ({user,handleFunction}) => {
  return (
    <Box onClick={handleFunction} cursor="pointer" bg="#E8E8E8" _hover={{background:"#38B2AC", color:"white"}} w="100%" display="flex" alignItems="center" borderRadius="lg" color="black" px={3} py={2} mb={2}>
        <Avatar mr={2} size="sm" cursor="pointer" name={user.name} src={user.profilePic}></Avatar>
        <Box>
            <Text>{user.name}</Text>
            <Text fontSize="xs"><b>{user.email}</b></Text>
        </Box>
    </Box>
  )
}

export default UserListItem