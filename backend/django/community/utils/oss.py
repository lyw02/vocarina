from __future__ import annotations

import json
import os
import tempfile
from itertools import islice
from typing import BinaryIO

import oss2
import requests
from alibabacloud_credentials.client import Client
from alibabacloud_credentials.models import Config
from dotenv import load_dotenv
from oss2 import CredentialsProvider
from oss2.credentials import Credentials, EnvironmentVariableCredentialsProvider

load_dotenv()

ALI_CLOUD_OSS_ACCESS_KEY_ID = os.environ.get('ALI_CLOUD_OSS_ACCESS_KEY_ID')
ALI_CLOUD_OSS_ACCESS_KEY_SECRET = os.environ.get('ALI_CLOUD_OSS_ACCESS_KEY_SECRET')
ALI_CLOUD_OSS_ROLE_ARN = os.environ.get('ALI_CLOUD_OSS_ROLE_ARN')
ALI_CLOUD_OSS_ROLE_SESSION_NAME = os.environ.get('ALI_CLOUD_OSS_ROLE_SESSION_NAME')

class CredentialProviderWrapper(CredentialsProvider):
    def __init__(self, client):
        self.client = client

    def get_credentials(self):
        access_key_id = self.client.get_access_key_id()
        access_key_secret = self.client.get_access_key_secret()
        security_token = self.client.get_security_token()
        return Credentials(access_key_id, access_key_secret, security_token)


config = Config(
    type='ram_role_arn',
    access_key_id=ALI_CLOUD_OSS_ACCESS_KEY_ID,
    access_key_secret=ALI_CLOUD_OSS_ACCESS_KEY_SECRET,
    role_arn=ALI_CLOUD_OSS_ROLE_ARN,
    role_session_name=ALI_CLOUD_OSS_ROLE_SESSION_NAME
)

cred = Client(config)

credentials_provider = CredentialProviderWrapper(cred)

auth = oss2.ProviderAuth(credentials_provider)

endpoint = 'https://oss-eu-west-1.aliyuncs.com'

bucket_name = 'vocarina'

bucket = oss2.Bucket(auth, endpoint, bucket_name, connect_timeout=30)

bucket.create_bucket(oss2.models.BUCKET_ACL_PRIVATE)


def upload_file_from_local(object_file_path: str, local_file_path: str):
    # Upload file to OSS from local file.
    bucket.put_object_from_file(object_file_path, local_file_path)


def upload_file_directly(object_file_path: str, file: str | BinaryIO):
    # Upload file to OSS directly.
    try:
        if type(file) is str:

            with open(file, "rb") as f:
                bucket.put_object(object_file_path, f)
        else:
            bucket.put_object(object_file_path, file)
        return "success"
    except Exception as e:
        raise e


def download_file(object_file_path: str, local_file_path: str):
    # Download file from OSS。
    bucket.get_object_to_file(object_file_path, local_file_path)


def get_file_object(object_file_path: str):
    # bucket.get_object() returns a File-Like Object, it is also an Iterable.
    object_stream = bucket.get_object(object_file_path)
    # _ = object_stream.read()
    # # get_object() returns a stream, which needs to execute read() to calculate the CRC checksum of the Object.
    # assert object_stream.client_crc == object_stream.server_crc, ("The CRC checksum between client and server is "
    #                                                                "inconsistent!")
    return object_stream


def get_file_url(filepath: str):
    url = bucket.sign_url("GET", filepath, 3600, slash_safe=True)

    return url


def get_file_by_url(url: str):
    resp = requests.get(url)

    return resp


def list_n_files(file_number: int) -> list:
    # List n files in bucket
    res = []
    for b in islice(oss2.ObjectIterator(bucket), file_number):
        res.append(b.key)
    return res


def list_all_files() -> list:
    # List all files in bucket
    res = []
    for obj in oss2.ObjectIterator(bucket):
        res.append(obj.key)
    return res


def list_all_files_in_dir(dir_: str) -> list:
    # E.g. list all files in fun/ dir, including files in sub dirs: prefix='fun/'。
    res = []
    for obj in oss2.ObjectIterator(bucket, prefix=dir_):
        res.append(obj.key)
    return res[1:]


def rename_file(old_object_file_path: str, new_object_file_path: str,):
    src_object_name = old_object_file_path
    dest_object_name = new_object_file_path
    # Copy old object to new object。
    bucket.copy_object(bucket_name, src_object_name, dest_object_name)
    # Delete old object。
    bucket.delete_object(src_object_name)


def delete_file(object_file_path: str):
    # Delete file from OSS。
    bucket.delete_object(object_file_path)


def create_dir(dir_: str):
    # Create dir, example: 'exampledir/'
    bucket.put_object(dir_, '')


def delete_dir(dir_: str):
    # Delete dir, example: 'exampledir/'
    for obj in oss2.ObjectIterator(bucket, prefix=dir_):
        bucket.delete_object(obj.key)


def exists(object_file_path: str) -> bool:
    return bucket.object_exists(object_file_path)
