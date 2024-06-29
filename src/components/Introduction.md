# Hash Generator Utility

### About
In order to submit files to the repository, teams need to provide a participant mapping file that maps a person's personal identifiers (PI) to that person's study participant ID.  To avoid having to store personal identifiers, this tool allows teams to generate a hash value based on a combination of fields in the participant mapping excel file.  

The hash value is computed in the users browser.  Data is not being transmitted to another server in order to compute the hash.

Once the hash is created, teams can download the participantID-hash value mapping and submit that file.

Note that the hash value will be hashed once more before it is stored in our database.
