import ast
import base64
import json
import traceback

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse, StreamingHttpResponse, HttpResponse
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from .models import Project, Track, Note
from .serializer import ProjectSerializer, TrackSerializer, NoteSerializer

from .process.audioProcessor import AudioProcessor


class ProjectView(GenericAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = "id"

    def get(self, request, id=None):

        try:

            if id is not None and request.query_params.get("action") == "load":
                """Get detail of a single project"""
                print("here")
                serializer = self.get_serializer(instance=self.get_object())
                print(f"serializer.data.id: {serializer.data.get('id')}")
                tracks = Track.objects.filter(project_id=serializer.data.get("id"))
                print(f"len(tracks): {len(tracks)}")
                if len(tracks) > 1:
                    tracks_serializer = TrackSerializer(tracks, many=True)
                    tracks_res = []
                    print("tracks_serializer.data: ", tracks_serializer.data)
                    for track_data in tracks_serializer.data:
                        notes = Note.objects.filter(track_id=track_data.get("id"))
                        print("len(notes): ", len(notes))
                        notes_res = []
                        if len(notes) > 1:
                            notes_serializer = NoteSerializer(notes, many=True)
                        else:
                            notes_serializer = NoteSerializer(notes[0])
                        notes_res.append(notes_serializer.data)
                        tracks_res.append({**track_data, "sheet": notes_res})
                    return Response({**serializer.data, "tracks": tracks_res}, status=status.HTTP_200_OK)
                else:
                    tracks_serializer = TrackSerializer(tracks[0])
                    notes = Note.objects.filter(track_id=tracks_serializer.data.get("id"))
                    notes_res = []
                    if len(notes) > 1:
                        notes_serializer = NoteSerializer(instance=notes, many=True)
                    else:
                        notes_serializer = NoteSerializer(notes[0])
                    notes_res.append(notes_serializer.data[0])
                    print(f"notes_res: {notes_res}")
                    return Response({**serializer.data, "tracks": [{**tracks_serializer.data, "sheet": notes_res}]},
                                    status=status.HTTP_200_OK)
            elif id is not None:
                """Get a single project"""
                serializer = self.get_serializer(instance=self.get_object())
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                """Get all projects"""
                serializer = self.get_serializer(instance=self.get_queryset(), many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": e}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """Save new project"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Validate project
            tracks_data = request.data.get("tracks")
            tracks_res = []
            for track_data in tracks_data:
                # Validate each track
                track_data_to_serialize = {
                    "track_id": track_data.get("trackId"),
                    "project_id": serializer.data.get("id"),
                    "inst_url": "",
                    "track_name": track_data.get("trackName"),
                    "status": track_data.get("trackState"),
                    "track_type": track_data.get("trackType"),
                }
                track_serializer = TrackSerializer(data=track_data_to_serialize)
                if track_serializer.is_valid():
                    track_serializer.save()
                    notes_data = track_data.get("sheet")
                    notes_res = []
                    for note_data in notes_data:
                        # Validate each note
                        note_serializer = NoteSerializer(
                            data={"track_id": track_serializer.validated_data.get("track_id"), **note_data})
                        if note_serializer.is_valid():
                            notes_res.append({**note_serializer.validated_data,
                                              "track_id": track_serializer.validated_data.get("track_id")})
                            note_serializer.save()
                        else:
                            return Response({"scope": "note", "message": note_serializer.errors},
                                            status=status.HTTP_400_BAD_REQUEST)
                    tracks_res.append({**track_serializer.data, "sheet": notes_res})
                else:
                    return Response({"scope": "track", "message": track_serializer.errors},
                                    status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response({**serializer.data, "tracks": tracks_res}, status=status.HTTP_200_OK)
        else:
            return Response({"scope": "project", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        """Update project"""

        def _diff():
            ...

        serializer = self.get_serializer(instance=self.get_object(), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def project_api(request, project_id=None, user_id=None):
    if project_id is not None and request.method == 'GET':
        project = Project.objects.get(id=project_id)
        project_serializer = ProjectSerializer(project)
        return JsonResponse(project_serializer.data, safe=False, status=201)
    elif user_id is not None and request.method == 'GET':
        # All projects from a user
        projects = Project.objects.filter(user_id=user_id)
        if len(projects) > 1:
            projects_serializer = ProjectSerializer(projects, many=True)
        else:
            projects_serializer = ProjectSerializer(projects[0])
        return JsonResponse(projects_serializer.data, safe=False, status=201)
    elif request.method == 'GET':
        projects = Project.objects.all()
        projects_serializer = ProjectSerializer(projects, many=True)
        return JsonResponse(projects_serializer.data, safe=False, status=201)
    elif request.method == 'POST':
        project = JSONParser().parse(request)
        project_serializer = ProjectSerializer(data=project)
        if project_serializer.is_valid():
            project_serializer.save()
            return JsonResponse("Project created.", safe=False, status=201)
        else:
            print(project_serializer.errors)
        return JsonResponse("Failed to create project.", safe=False, status=400)
    elif request.method == 'PUT':
        new_project = JSONParser().parse(request)
        old_project = Project.objects.get(id=new_project['id'])
        project_serializer = ProjectSerializer(old_project, data=new_project)
        if project_serializer.is_valid():
            project_serializer.save()
            return JsonResponse(f"Project {new_project['id']} updated.", safe=False, status=201)
        return JsonResponse(f"Failed to update project {new_project['id']}.", safe=False, status=400)
    elif project_id is not None and request.method == 'DELETE':
        project = Project.objects.get(id=project_id)
        project.delete()
        return JsonResponse(f"Project {project_id} deleted.", safe=False, status=201)


@csrf_exempt
def audio_process_api(request):
    if request.method == 'POST':

        try:
            data = json.loads(request.body)
            print(data)
            tracks = data.get("tracksDataProcessed", [])

            base64_res_list = []
            base64_final_list = []
            for i, track in enumerate(tracks):
                # current_track = tracks[i]
                lyrics = track.get("lyrics")
                start_time = track.get("startTime")
                target_pitch_list = track.get("targetPitchList")
                target_duration_list = track.get("targetDurationList")

                audio_processor = (AudioProcessor()
                                   .generate(lyrics, target_duration_list)
                                   .set_pitch_to_avg(target_pitch_list)
                                   .edit_pitch(target_pitch_list)
                                   .edit_duration(target_duration_list, target_pitch_list)
                                   .remove_silence(target_pitch_list)
                                   .generate_final_audio(start_time)
                                   )

                # base64_res = audio_processor.base64_res
                # base64_final = audio_processor.base64_final
                base64_res_list.append({"id": track.get("trackId"), "data": audio_processor.base64_res})
                base64_final_list.append({"id": track.get("trackId"), "data": audio_processor.base64_final})

            # print(f"base64_final: {base64_final}")
            return JsonResponse(json.dumps({
                "dataArr": base64_res_list,
                "finalData": base64_final_list
            }), safe=False, status=status.HTTP_200_OK)

        except Exception as e:
            traceback.print_exc()
            return JsonResponse(f"Exception: {e}", safe=False, status=400)
