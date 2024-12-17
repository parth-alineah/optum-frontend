import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonProps,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import React, { Dispatch, SetStateAction, useRef } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'
import { VITE_APP_IMAGE_GET } from '@/utils/envVariables'

type Props = {
  imageUrl: string | null
  setImageUrl: Dispatch<SetStateAction<string | null>>
  handleFileChange: (event: any) => void
  handleResetImage: (event: any) => void
  editable?: boolean
}

const FileUploadInput = ({
  imageUrl,
  setImageUrl,
  handleFileChange,
  handleResetImage,
  editable,
}: Props) => {
  const uploadInputRef = useRef<any>(null)
  const handleUploadClick = () => {
    uploadInputRef?.current.click()
  }
  return (
    <Grid display={'flex'} justifyContent={'center'} marginBottom={'20px'}>
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
        <Box padding={1}>
          <Badge
            badgeContent={
              <IconButton onClick={handleResetImage}>
                <CancelIcon />
              </IconButton>
            }
          >
            <Avatar
              src={
                imageUrl
                  ? imageUrl?.startsWith('/uploads')
                    ? `${VITE_APP_IMAGE_GET}${imageUrl}?token=123`
                    : imageUrl
                  : ''
              }
              sx={{ width: 70, height: 70 }}
              // className={sideBarStyle.sidebarProfile}
            />
          </Badge>
        </Box>
        <Button
          //   {...(selectedBtnProps as ButtonProps)}
          sx={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            justifySelf: 'end',
          }}
          onClick={handleUploadClick}
          // disabled={!editable}
          color='mBlue'
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: '500',
              textTransform: 'capitalize',
            }}
          >
            Upload Image
          </Typography>
          {/* <FileUpload {...{ fill: '#ffffff' }} /> */}
          <input
            accept='image/*'
            type='file'
            style={{ display: 'none' }}
            ref={uploadInputRef}
            onChange={handleFileChange}
          />
        </Button>
      </Box>
    </Grid>
  )
}

export default FileUploadInput
