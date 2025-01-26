const { exec } = require('child_process');
const path = require('path');
const dayjs = require('dayjs');
require('dotenv').config();

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

const backupDir = path.join(__dirname, '..');
const filename = `db_backup_snapshot.sql`;
const filePath = path.join(backupDir, filename);

const command = `mysqldump -h ${MYSQL_HOST} -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} > "${filePath}"`;

console.log(`Starting backup of database ${MYSQL_DATABASE}...`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error creating backup: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`Warning during backup: ${stderr}`);
  }
  console.log(`Backup completed successfully: ${filePath}`);
  process.exit(0);
});