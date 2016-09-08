import httplib2
import os
import datetime
import argparse
import io
import sys
import datetime

from apiclient import discovery
import oauth2client
from oauth2client import client
from oauth2client import tools
from googleapiclient.http import MediaIoBaseDownload
from flask import Flask
from flask_restful import Resource, Api, reqparse


SCOPES = 'https://www.googleapis.com/auth/drive'
CLIENT_SECRET_FILE = 'client_secret.json'
APPLICATION_NAME = 'Signup Form'
FEATURED_DOGS_FOLDER = '0B-mj_1f0ZZvRSk9XNXpaWDN1eU0'


def get_credentials():
    """Gets valid user credentials from storage.

    If nothing has been stored, or if the stored credentials are invalid,
    the OAuth2 flow is completed to obtain the new credentials.

    Returns:
        Credentials, the obtained credential.
    """
    home_dir = os.path.expanduser('~')
    credential_dir = os.path.join(home_dir, '.credentials')
    if not os.path.exists(credential_dir):
        os.makedirs(credential_dir)
    credential_path = os.path.join(credential_dir,
                                   'drive.googleapis.com-signup.json')

    store = oauth2client.file.Storage(credential_path)
    credentials = store.get()
    if not credentials or credentials.invalid:
        flow = client.flow_from_clientsecrets(CLIENT_SECRET_FILE, SCOPES)
        flow.user_agent = APPLICATION_NAME
        flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
        credentials = tools.run_flow(flow, store, flags)
    return credentials


def get_service(credentials):
    http = credentials.authorize(httplib2.Http())
    service = discovery.build('drive', 'v3', http=http)
    return service


def download(service, file_id, target):
    request = service.files().get_media(fileId=file_id)
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
    with open(target, 'w+b') as out:
        out.write(fh.getvalue())
        
        
def get_files(service, since=None):
    """Get files that were modified after 'since' date.

    'since' is a datetime in UTC.

    """

    if since is None:
        since = datetime.datetime.fromtimestamp(0)
    q = "'{FOLDER}' in parents and modifiedTime > '{SINCE}'".format(
        FOLDER=FEATURED_DOGS_FOLDER,
        SINCE=since.isoformat())
    files = service.files().list(
        q=q, fields='files(description,id,name)').execute()
    if not files['files']:
        return

    q = "'{FOLDER}' in parents and not trashed".format(
        FOLDER=FEATURED_DOGS_FOLDER)
    files = service.files().list(
        q=q, fields='files(description,id,name)').execute()
    pics = []
    for file in files['files']:
        target = os.path.join('featured', file['name'])
        download(service, file['id'], target)
        pics.append("""
                  <div class="carousel-item" >
                    <a class=""
                       href="#one!"><img src="{TARGET}"></a>
                    <p class="center">
                      {DESCR}
                    </p>
                  </div>""".format(
                      TARGET=target,
                      DESCR=file['description']))

    template = open('index.html.template').read()
    with open('index.html', 'w') as out:
        out.write(template.format(CAROUSEL=''.join(pics)))
    
                  
        
    
