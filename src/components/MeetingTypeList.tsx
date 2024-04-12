"use client"
import { useState } from "react";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";

const MeetingTypeList = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  });
  const [callDetails, setCallDetails] = useState<Call>();

  const createMeeting = async () => {
    if(!client || !user) return;

    try{
      if(!values.dateTime){
        toast({
          title: 'Please select a date and a time',
        })
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if(!call) throw new Error('Failed to create a call');

      const startsAt = values.dateTime || new Date(Date.now());
      const description = values.description || 'Instant meeting';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })
      setCallDetails(call);

      if(!values.description){
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: 'Meeting created',
      })
    }catch(err){
      toast({
        title: 'Failed to create a meeting',
      })
      console.log(err);
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'>
      <HomeCard
        color="bg-orange-1"
        image="/icons/add-meeting.svg"
        title="New meeting"
        description="Start an instant meeting"
        handleClick={()=>setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        color="bg-blue-1"
        image="/icons/schedule.svg"
        title="Schedule meeting"
        description="Plan your meeting"
        handleClick={()=>setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        color="bg-purple-1"
        image="/icons/recordings.svg"
        title="View recordings"
        description="Check out your recordings"
        handleClick={()=>router.push('/recordings')}
      />
      <HomeCard
        color="bg-yellow-1"
        image="/icons/join-meeting.svg"
        title="Join meeting"
        description="Via invitation link"
        handleClick={()=>setMeetingState('isJoiningMeeting')}
      />
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          className="text-center"
          buttonText="Start Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="new-meeting-desc" 
              className="text-base text-normal leading-[22px] text-sky-2"
            >
              Add a description
            </label>
            <Textarea
              id="new-meeting-desc"
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible-ring-offset-0"
              onChange={(e)=>{
                setValues({...values, description: e.target.value})
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label
              htmlFor="new-meeting-desc" 
              className="text-base text-normal leading-[22px] text-sky-2"
            >
              Select date and time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ): (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Meeting created"
          className="text-center"
          buttonText="Copy meeting link"
          handleClick={()=>{
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link copied" })
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        />
      )}
      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Join a meeting"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={()=>{
          console.log(values.link)
          router.push(values.link)
        }}
      >
        <Input
          placeholder="Meeting link"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e)=>setValues({...values, link: e.target.value})}
        />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList