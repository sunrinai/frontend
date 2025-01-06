# 주고받기

## POST /job/new
INPUT
(이미지랑 텍스트 파일을 동시 전송)

## OUTPUT
{"job_id": id}

## GET /job/{id}/status
status는 Pending, Working, Done 이 있음
{"status": status}

## GET /job/{id}
{
"keypoints": [ string... ]
"images": [ image links ]
}

## GET /job/{id}/stt
