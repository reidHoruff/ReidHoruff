import os
import sys

from django.core.handlers.wsgi import WSGIHandler

path = '/home/reidhoruff/webapps/reidhoruff/ReidHoruff'
if path not in sys.path:
	sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'ReidHoruff.settings'
application = WSGIHandler()
