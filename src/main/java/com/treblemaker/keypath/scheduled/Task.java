package com.treblemaker.keypath.scheduled;

import com.treblemaker.keypath.database.MidiDB;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class Task {
    private static final Logger log = LoggerFactory.getLogger(Task.class);
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    public static MidiDB midiDB = new MidiDB();

    @Scheduled(fixedRate = 60000)
    public void cleanupMidiFiles() throws IOException {
        log.info("Cleanup Task is running now {}", dateFormat.format(new Date()));

        midiDB.deleteExpiredSessions();
        midiDB.deleteExpiredFiles();
    }
}
